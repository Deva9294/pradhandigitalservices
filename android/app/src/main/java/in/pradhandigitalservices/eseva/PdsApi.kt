package `in`.pradhandigitalservices.eseva

import android.content.Context
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

data class ApiService(val id: String, val name: String, val description: String, val slug: String)
data class ApiBooking(val id: String, val serviceName: String, val status: String, val createdAt: String)

object PdsApi {
    private const val BASE_URL = "https://pradhan-frontend-4g39.onrender.com/api"

    private fun request(path: String, method: String = "GET", body: JSONObject? = null, token: String? = null): JSONObject {
        val connection = (URL(BASE_URL + path).openConnection() as HttpURLConnection).apply {
            requestMethod = method
            connectTimeout = 15000
            readTimeout = 20000
            setRequestProperty("Accept", "application/json")
            if (body != null) {
                doOutput = true
                setRequestProperty("Content-Type", "application/json; charset=utf-8")
            }
            if (!token.isNullOrBlank()) setRequestProperty("Authorization", "Bearer " + token)
        }
        try {
            if (body != null) connection.outputStream.use { it.write(body.toString().toByteArray(Charsets.UTF_8)) }
            val stream = if (connection.responseCode in 200..299) connection.inputStream else connection.errorStream
            val raw = stream?.bufferedReader()?.use { it.readText() }.orEmpty()
            val result = if (raw.isBlank()) JSONObject() else JSONObject(raw)
            if (connection.responseCode !in 200..299 || !result.optBoolean("success", true)) {
                throw IllegalStateException(result.optString("message").ifBlank { "Request failed (" + connection.responseCode + ")" })
            }
            return result
        } finally {
            connection.disconnect()
        }
    }

    suspend fun login(context: Context, phone: String, password: String): String = withContext(Dispatchers.IO) {
        val body = JSONObject().put("phone", phone).put("password", password)
        val result = request("/auth/login", "POST", body)
        val token = result.optString("token")
        if (token.isBlank()) throw IllegalStateException("Login token was not returned by server")
        context.getSharedPreferences("pds_session", Context.MODE_PRIVATE).edit()
            .putString("token", token)
            .putString("name", result.optJSONObject("user")?.optString("name").orEmpty())
            .apply()
        result.optJSONObject("user")?.optString("name").orEmpty()
    }

    suspend fun services(): List<ApiService> = withContext(Dispatchers.IO) {
        val result = request("/services")
        val array = result.optJSONArray("services") ?: return@withContext emptyList()
        buildList {
            for (i in 0 until array.length()) {
                val item = array.optJSONObject(i) ?: continue
                add(ApiService(item.optString("_id"), item.optString("name"), item.optString("description"), item.optString("slug")))
            }
        }
    }

    suspend fun bookings(context: Context): List<ApiBooking> = withContext(Dispatchers.IO) {
        val token = context.getSharedPreferences("pds_session", Context.MODE_PRIVATE).getString("token", null)
            ?: throw IllegalStateException("Please sign in to view your orders")
        val result = request("/bookings", token = token)
        val array = result.optJSONArray("bookings") ?: return@withContext emptyList()
        buildList {
            for (i in 0 until array.length()) {
                val item = array.optJSONObject(i) ?: continue
                val service = item.optJSONObject("service")
                add(ApiBooking(item.optString("_id"), item.optString("serviceName").ifBlank { service?.optString("name").orEmpty() }, item.optString("status", "pending"), item.optString("createdAt")))
            }
        }
    }

    fun savedToken(context: Context): String? =
        context.getSharedPreferences("pds_session", Context.MODE_PRIVATE).getString("token", null)

    fun savedName(context: Context): String =
        context.getSharedPreferences("pds_session", Context.MODE_PRIVATE).getString("name", "").orEmpty()

    fun logout(context: Context) {
        context.getSharedPreferences("pds_session", Context.MODE_PRIVATE).edit().clear().apply()
    }
}
