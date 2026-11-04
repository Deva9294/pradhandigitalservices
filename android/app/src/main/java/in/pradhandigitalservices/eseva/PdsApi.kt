package `in`.pradhandigitalservices.eseva

import android.content.Context
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

data class ApiService(
    val id: String,
    val name: String,
    val description: String,
    val slug: String,
    val category: String = "",
    val price: Double = 0.0,
    val governmentFee: Double = 0.0,
    val serviceCharge: Double = 0.0,
    val processingTime: String = "",
    val requiredDocuments: List<String> = emptyList()
)
data class ApiBooking(val id: String, val serviceName: String, val status: String, val createdAt: String)

object PdsApi {
    private const val BASE_URL = "https://pradhan-frontend-4g39.onrender.com/api"

    private fun request(path: String, method: String = "GET", body: JSONObject? = null, token: String? = null): JSONObject {
        val connection = (URL(BASE_URL + path).openConnection() as HttpURLConnection).apply {
            requestMethod = method
            connectTimeout = 20000
            readTimeout = 25000
            setRequestProperty("Accept", "application/json")
            if (body != null) {
                doOutput = true
                setRequestProperty("Content-Type", "application/json; charset=utf-8")
            }
            if (!token.isNullOrBlank()) setRequestProperty("Authorization", "Bearer $token")
        }
        try {
            if (body != null) connection.outputStream.use { it.write(body.toString().toByteArray(Charsets.UTF_8)) }
            val code = connection.responseCode
            val stream = if (code in 200..299) connection.inputStream else connection.errorStream
            val raw = stream?.bufferedReader()?.use { it.readText() }.orEmpty()
            val result = if (raw.isBlank()) JSONObject() else JSONObject(raw)
            if (code !in 200..299 || !result.optBoolean("success", true)) {
                throw IllegalStateException(result.optString("message").ifBlank { "Request failed ($code)" })
            }
            return result
        } finally { connection.disconnect() }
    }

    private fun parseService(item: JSONObject): ApiService {
        val docs = mutableListOf<String>()
        val array = item.optJSONArray("requiredDocuments") ?: item.optJSONArray("documentsRequired")
        if (array != null) for (i in 0 until array.length()) docs.add(array.optString(i))
        return ApiService(
            id = item.optString("_id"),
            name = item.optString("name"),
            description = item.optString("description"),
            slug = item.optString("slug"),
            category = item.optString("category"),
            price = item.optDouble("price", item.optDouble("totalFee", 0.0)),
            governmentFee = item.optDouble("governmentFee", 0.0),
            serviceCharge = item.optDouble("serviceCharge", 0.0),
            processingTime = item.optString("processingTime"),
            requiredDocuments = docs
        )
    }

    suspend fun login(context: Context, phone: String, password: String): String = withContext(Dispatchers.IO) {
        val result = request("/auth/login", "POST", JSONObject().put("phone", phone).put("password", password))
        val token = result.optString("token")
        if (token.isBlank()) throw IllegalStateException("Login token was not returned by server")
        val name = result.optJSONObject("user")?.optString("name").orEmpty()
        context.getSharedPreferences("pds_session", Context.MODE_PRIVATE).edit()
            .putString("token", token).putString("name", name).apply()
        name
    }

    suspend fun services(search: String = ""): List<ApiService> = withContext(Dispatchers.IO) {
        val query = if (search.isBlank()) "" else "?search=" + java.net.URLEncoder.encode(search, "UTF-8")
        val result = request("/services$query")
        val array = result.optJSONArray("services") ?: return@withContext emptyList()
        buildList { for (i in 0 until array.length()) array.optJSONObject(i)?.let { add(parseService(it)) } }
    }

    suspend fun service(slug: String): ApiService = withContext(Dispatchers.IO) {
        parseService(request("/services/" + java.net.URLEncoder.encode(slug, "UTF-8")).getJSONObject("service"))
    }

    suspend fun createBooking(context: Context, service: ApiService, applicantName: String, notes: String): String = withContext(Dispatchers.IO) {
        val token = savedToken(context) ?: throw IllegalStateException("Please sign in first")
        if (service.id.isBlank()) throw IllegalStateException("Service details are unavailable. Please refresh and try again.")
        val body = JSONObject()
            .put("serviceId", service.id)
            .put("formData", JSONObject().put("applicantName", applicantName))
            .put("documents", JSONArray())
            .put("notes", notes)
        val result = request("/bookings", "POST", body, token)
        result.optJSONObject("booking")?.optString("_id").orEmpty()
    }

    suspend fun bookings(context: Context): List<ApiBooking> = withContext(Dispatchers.IO) {
        val token = savedToken(context) ?: throw IllegalStateException("Please sign in to view your orders")
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

    fun savedToken(context: Context): String? = context.getSharedPreferences("pds_session", Context.MODE_PRIVATE).getString("token", null)
    fun savedName(context: Context): String = context.getSharedPreferences("pds_session", Context.MODE_PRIVATE).getString("name", "").orEmpty()
    fun logout(context: Context) { context.getSharedPreferences("pds_session", Context.MODE_PRIVATE).edit().clear().apply() }
}