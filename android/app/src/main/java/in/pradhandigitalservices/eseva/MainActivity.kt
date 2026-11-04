package in.pradhandigitalservices.eseva

import android.app.Activity
import android.app.DownloadManager
import android.content.ActivityNotFoundException
import android.content.Intent
import android.graphics.Color
import android.graphics.Typeface
import android.net.Uri
import android.os.Bundle
import android.os.Environment
import android.view.Gravity
import android.view.View
import android.webkit.CookieManager
import android.webkit.DownloadListener
import android.webkit.URLUtil
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast

class MainActivity : Activity() {
    private lateinit var webView: WebView
    private lateinit var progress: ProgressBar
    private var fileChooserCallback: ValueCallback<Array<Uri>>? = null
    private val fileChooserRequest = 4102
    private val homeUrl = "https://pradhan-frontend-4g39.onrender.com/"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.statusBarColor = Color.rgb(10, 27, 77)
        window.navigationBarColor = Color.rgb(10, 27, 77)

        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(Color.WHITE)
        }
        val toolbar = TextView(this).apply {
            text = "P   Pradhan eSeva"
            textSize = 19f
            setTextColor(Color.WHITE)
            typeface = Typeface.DEFAULT_BOLD
            gravity = Gravity.CENTER_VERTICAL
            setPadding(dp(18), 0, dp(18), 0)
            setBackgroundColor(Color.rgb(10, 27, 77))
        }
        root.addView(toolbar, LinearLayout.LayoutParams(-1, dp(56)))

        val webContainer = FrameLayout(this)
        webView = WebView(this)
        progress = ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal).apply {
            max = 100
            progress = 0
            isIndeterminate = false
        }
        webContainer.addView(webView, FrameLayout.LayoutParams(-1, -1))
        webContainer.addView(progress, FrameLayout.LayoutParams(-1, dp(3), Gravity.TOP))
        root.addView(webContainer, LinearLayout.LayoutParams(-1, 0, 1f))
        root.addView(createBottomNavigation(), LinearLayout.LayoutParams(-1, dp(62)))
        setContentView(root)

        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.settings.databaseEnabled = true
        webView.settings.loadsImagesAutomatically = true
        webView.settings.javaScriptCanOpenWindowsAutomatically = true
        webView.settings.setSupportMultipleWindows(false)
        webView.settings.allowFileAccess = false
        webView.settings.allowContentAccess = true
        webView.settings.userAgentString = webView.settings.userAgentString + " PradhanESevaAndroid/1.0"
        CookieManager.getInstance().setAcceptCookie(true)
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true)

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val uri = request?.url ?: return false
                val scheme = uri.scheme ?: return false
                if (scheme == "http" || scheme == "https") {
                    val host = uri.host.orEmpty()
                    val internal = host == "pradhan-frontend-4g39.onrender.com" ||
                        host == "pradhandigitalservices.in" ||
                        host == "www.pradhandigitalservices.in"
                    if (internal) return false
                }
                openExternal(uri)
                return true
            }
        }
        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                progress.progress = newProgress
                progress.visibility = if (newProgress >= 100) View.GONE else View.VISIBLE
            }
            override fun onShowFileChooser(
                view: WebView?,
                callback: ValueCallback<Array<Uri>>?,
                params: FileChooserParams?
            ): Boolean {
                fileChooserCallback?.onReceiveValue(null)
                fileChooserCallback = callback
                val intent = Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
                    addCategory(Intent.CATEGORY_OPENABLE)
                    type = "*/*"
                    putExtra(Intent.EXTRA_MIME_TYPES, arrayOf("image/*", "application/pdf"))
                    putExtra(Intent.EXTRA_ALLOW_MULTIPLE, false)
                }
                return try {
                    startActivityForResult(intent, fileChooserRequest)
                    true
                } catch (_: ActivityNotFoundException) {
                    fileChooserCallback = null
                    false
                }
            }
        }
        webView.setDownloadListener(DownloadListener { url, userAgent, contentDisposition, mimeType, _ ->
            try {
                val request = DownloadManager.Request(Uri.parse(url))
                val cookies = CookieManager.getInstance().getCookie(url)
                if (!cookies.isNullOrBlank()) request.addRequestHeader("Cookie", cookies)
                request.addRequestHeader("User-Agent", userAgent)
                request.setTitle(URLUtil.guessFileName(url, contentDisposition, mimeType))
                request.setDescription("Downloading from Pradhan eSeva")
                request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                request.setDestinationInExternalPublicDir(
                    Environment.DIRECTORY_DOWNLOADS,
                    URLUtil.guessFileName(url, contentDisposition, mimeType)
                )
                (getSystemService(DOWNLOAD_SERVICE) as DownloadManager).enqueue(request)
                Toast.makeText(this, "Download started", Toast.LENGTH_SHORT).show()
            } catch (_: Exception) {
                Toast.makeText(this, "Download could not start", Toast.LENGTH_LONG).show()
            }
        })

        if (savedInstanceState == null) webView.loadUrl(homeUrl) else webView.restoreState(savedInstanceState)
    }

    private fun createBottomNavigation(): LinearLayout {
        val nav = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
            setBackgroundColor(Color.WHITE)
            elevation = dp(10).toFloat()
        }
        val items = listOf(
            "⌂\nHome" to "",
            "▦\nServices" to "services",
            "▤\nVacancy" to "vacancies",
            "◷\nOrders" to "dashboard",
            "●\nAccount" to "login"
        )
        items.forEach { (label, route) ->
            val item = TextView(this).apply {
                text = label
                textSize = 11f
                setTextColor(Color.rgb(10, 27, 77))
                gravity = Gravity.CENTER
                setPadding(dp(2), dp(5), dp(2), dp(4))
                setOnClickListener { webView.loadUrl(homeUrl + route) }
            }
            nav.addView(item, LinearLayout.LayoutParams(0, -1, 1f))
        }
        return nav
    }

    private fun dp(value: Int): Int = (value * resources.displayMetrics.density).toInt()

    private fun openExternal(uri: Uri) {
        try {
            startActivity(Intent(Intent.ACTION_VIEW, uri))
        } catch (_: ActivityNotFoundException) {
            Toast.makeText(this, "No app found to open this link", Toast.LENGTH_SHORT).show()
        }
    }

    @Deprecated("Deprecated by Android, retained for broad device compatibility")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == fileChooserRequest) {
            val result = if (resultCode == RESULT_OK) data?.data?.let { arrayOf(it) } else null
            fileChooserCallback?.onReceiveValue(result)
            fileChooserCallback = null
        }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        webView.saveState(outState)
        super.onSaveInstanceState(outState)
    }

    @Suppress("DEPRECATION")
    override fun onBackPressed() {
        if (::webView.isInitialized && webView.canGoBack()) webView.goBack() else super.onBackPressed()
    }

    override fun onDestroy() {
        fileChooserCallback?.onReceiveValue(null)
        webView.stopLoading()
        webView.destroy()
        super.onDestroy()
    }
}
