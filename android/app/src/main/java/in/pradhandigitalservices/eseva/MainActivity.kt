package `in`.pradhandigitalservices.eseva

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.platform.LocalContext
import kotlinx.coroutines.launch
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

private val Navy = Color(0xFF0A1B4D)
private val Orange = Color(0xFFFF7A00)
private val Canvas = Color(0xFFF4F6FA)
private val Ink = Color(0xFF172033)
private val Muted = Color(0xFF687386)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.statusBarColor = android.graphics.Color.rgb(10, 27, 77)
        window.navigationBarColor = android.graphics.Color.rgb(255, 255, 255)
        window.decorView.systemUiVisibility = android.view.View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR
        setContent { PradhanApp() }
    }
}

private enum class Screen(val label: String) {
    HOME("Home"), SERVICES("Services"), ORDERS("Orders"), ACCOUNT("Account")
}

@Composable
private fun PradhanApp() {
    var current by remember { mutableStateOf(Screen.HOME) }
    var search by remember { mutableStateOf("") }
    var selectedService by remember { mutableStateOf<String?>(null) }
    var showLogin by remember { mutableStateOf(false) }
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    var loginError by remember { mutableStateOf("") }
    var loggedInName by remember { mutableStateOf(PdsApi.savedName(context)) }
    var isLoggedIn by remember { mutableStateOf(!PdsApi.savedToken(context).isNullOrBlank()) }
    var remoteServices by remember { mutableStateOf<List<ApiService>>(emptyList()) }
    var servicesError by remember { mutableStateOf("") }
    LaunchedEffect(Unit) {
        try { remoteServices = PdsApi.services() } catch (e: Exception) { servicesError = e.message ?: "Services are temporarily unavailable" }
    }

    MaterialTheme(
        colorScheme = lightColorScheme(
            primary = Navy, secondary = Orange, background = Canvas,
            surface = Color.White, onSurface = Ink
        )
    ) {
        Scaffold(
            containerColor = Canvas,
            topBar = {
                Column(Modifier.background(Navy)) {
                    Row(
                        Modifier.fillMaxWidth().height(60.dp).padding(horizontal = 18.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            Modifier.size(38.dp).background(Orange, RoundedCornerShape(12.dp)),
                            contentAlignment = Alignment.Center
                        ) { Text("P", color = Color.White, fontWeight = FontWeight.Black, fontSize = 24.sp) }
                        Spacer(Modifier.width(10.dp))
                        Column(Modifier.weight(1f)) {
                            Text("Pradhan eSeva", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                            Text("TRUST  •  DIGITAL  •  INNOVATION", color = Color(0xFFD7DDF0), fontSize = 8.sp, letterSpacing = 1.sp)
                        }
                        IconButton(onClick = { current = Screen.ACCOUNT }) {
                            Icon(Icons.Default.AccountCircle, contentDescription = "Account", tint = Color.White)
                        }
                    }
                    OutlinedTextField(
                        value = search, onValueChange = { search = it },
                        modifier = Modifier.fillMaxWidth().padding(start = 16.dp, end = 16.dp, bottom = 14.dp).height(52.dp),
                        placeholder = { Text("Search services...", fontSize = 14.sp) },
                        leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                        singleLine = true,
                        shape = RoundedCornerShape(14.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedContainerColor = Color.White, unfocusedContainerColor = Color.White,
                            focusedBorderColor = Orange, unfocusedBorderColor = Color.White,
                            focusedTextColor = Ink, unfocusedTextColor = Ink
                        )
                    )
                }
            },
            bottomBar = {
                NavigationBar(containerColor = Color.White, tonalElevation = 8.dp) {
                    Screen.values().forEach { screen ->
                        val icon = when (screen) {
                            Screen.HOME -> Icons.Default.Home
                            Screen.SERVICES -> Icons.Default.GridView
                            Screen.ORDERS -> Icons.Default.ReceiptLong
                            Screen.ACCOUNT -> Icons.Default.Person
                        }
                        NavigationBarItem(
                            selected = current == screen,
                            onClick = { current = screen; selectedService = null },
                            icon = { Icon(icon, contentDescription = screen.label) },
                            label = { Text(screen.label, fontSize = 11.sp) },
                            colors = NavigationBarItemDefaults.colors(selectedIconColor = Orange, indicatorColor = Color(0xFFFFE8D5), selectedTextColor = Navy)
                        )
                    }
                }
            }
        ) { padding ->
            Box(Modifier.fillMaxSize().padding(padding)) {
                when {
                    showLogin -> LoginScreen(onBack = { showLogin = false }, onLogin = { phone, password ->
                        scope.launch {
                            loginError = ""
                            try {
                                loggedInName = PdsApi.login(context, phone, password)
                                isLoggedIn = true
                                showLogin = false
                                current = Screen.ACCOUNT
                            } catch (e: Exception) { loginError = e.message ?: "Login failed" }
                        }
                    }, error = loginError)
                    selectedService != null -> ServiceDetail(selectedService!!, onBack = { selectedService = null }, onLogin = { showLogin = true })
                    current == Screen.HOME -> HomeScreen(
                        search = search,
                        services = remoteServices,
                        onServices = { current = Screen.SERVICES },
                        onSelect = { selectedService = it },
                        onLogin = { showLogin = true }
                    )
                    current == Screen.SERVICES -> ServicesScreen(search, remoteServices, servicesError, onSelect = { selectedService = it })
                    current == Screen.ORDERS -> OrdersScreen(context, isLoggedIn, onLogin = { showLogin = true })
                    else -> AccountScreen(loggedInName, isLoggedIn, onLogin = { showLogin = true }, onLogout = { PdsApi.logout(context); isLoggedIn = false; loggedInName = "" })
                }
            }
        }
    }
}

private val serviceItems = listOf(
    "Aadhaar Services" to "Identity and Aadhaar assistance",
    "PAN Card" to "New PAN and correction",
    "Voter Services" to "Voter ID and electoral services",
    "Ayushman Card" to "Health scheme assistance",
    "Samagra ID" to "Samagra family and member ID",
    "Income Certificate" to "Income and other certificates",
    "Domicile Certificate" to "Residence certificate assistance",
    "Caste Certificate" to "Caste certificate assistance",
    "Government Jobs" to "Latest vacancy and application updates",
    "Scholarships" to "Student scholarship services",
    "e-Shram Card" to "Worker registration assistance",
    "Online Forms" to "Online application and form support"
)

@Composable
private fun HomeScreen(search: String, services: List<ApiService>, onServices: () -> Unit, onSelect: (String) -> Unit, onLogin: () -> Unit) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Surface(shape = RoundedCornerShape(22.dp), color = Navy, modifier = Modifier.fillMaxWidth()) {
                Column(Modifier.padding(20.dp)) {
                    Text("WELCOME TO", color = Color(0xFFFFC28F), fontSize = 11.sp, fontWeight = FontWeight.Bold, letterSpacing = 2.sp)
                    Text("Pradhan Digital Services", color = Color.White, fontSize = 23.sp, fontWeight = FontWeight.ExtraBold)
                    Text("Your trusted digital service centre", color = Color(0xFFE1E7F5), fontSize = 13.sp)
                    Spacer(Modifier.height(16.dp))
                    Button(onClick = onServices, colors = ButtonDefaults.buttonColors(containerColor = Orange), shape = RoundedCornerShape(12.dp)) {
                        Text("Explore Services", color = Color.White, fontWeight = FontWeight.Bold)
                        Spacer(Modifier.width(8.dp)); Icon(Icons.Default.ArrowForward, null, tint = Color.White)
                    }
                }
            }
        }
        item { SectionHeading("Quick access", "Explore all", onServices) }
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                QuickTile("My Orders", Icons.Default.ReceiptLong, Modifier.weight(1f)) { onLogin() }
                QuickTile("Apply Online", Icons.Default.Description, Modifier.weight(1f)) { onServices() }
                QuickTile("Help & Support", Icons.Default.SupportAgent, Modifier.weight(1f)) { onLogin() }
            }
        }
        item { SectionHeading("Popular services", "View all", onServices) }
        items(services.filter { search.isBlank() || it.name.contains(search, true) || it.description.contains(search, true) }.take(6).size) { index ->
            val item = services.filter { search.isBlank() || it.name.contains(search, true) || it.description.contains(search, true) }.take(6)[index]
            ServiceRow(item.name, item.description) { onSelect(item.name) }
        }
        item {
            Surface(color = Color(0xFFFFF1E5), shape = RoundedCornerShape(16.dp)) {
                Row(Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.VerifiedUser, null, tint = Orange, modifier = Modifier.size(28.dp))
                    Spacer(Modifier.width(12.dp))
                    Column {
                        Text("Need assistance?", fontWeight = FontWeight.Bold, color = Navy)
                        Text("Sign in to access your service dashboard.", fontSize = 12.sp, color = Muted)
                    }
                }
            }
        }
    }
}

@Composable
private fun ServicesScreen(search: String, services: List<ApiService>, error: String, onSelect: (String) -> Unit) {
    val filtered = services.filter { search.isBlank() || it.name.contains(search, true) || it.description.contains(search, true) }
    LazyColumn(Modifier.fillMaxSize(), contentPadding = PaddingValues(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
        item { Text("All Services", fontSize = 23.sp, fontWeight = FontWeight.Bold, color = Navy); Text("Live catalogue from Pradhan Digital Services", color = Muted, fontSize = 13.sp) }
        if (error.isNotBlank()) item { Text(error, color = Color(0xFFB42318), modifier = Modifier.padding(8.dp)) }
        items(filtered.size) { i -> ServiceRow(filtered[i].name, filtered[i].description) { onSelect(filtered[i].name) } }
        if (filtered.isEmpty() && error.isBlank()) item { Text("No services found or catalogue is loading.", color = Muted, modifier = Modifier.padding(20.dp)) }
    }
}

@Composable
private fun ServiceDetail(name: String, onBack: () -> Unit, onLogin: () -> Unit) {
    Column(Modifier.fillMaxSize().padding(20.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("‹  Back", color = Navy, fontWeight = FontWeight.Bold, modifier = Modifier.clickable { onBack() })
        Surface(color = Color.White, shape = RoundedCornerShape(20.dp)) {
            Column(Modifier.padding(22.dp)) {
                Icon(Icons.Default.Assignment, null, tint = Orange, modifier = Modifier.size(42.dp))
                Spacer(Modifier.height(14.dp))
                Text(name, color = Navy, fontWeight = FontWeight.Bold, fontSize = 22.sp)
                Text("Pradhan Digital Services", color = Muted, fontSize = 13.sp)
                Spacer(Modifier.height(14.dp))
                Text("Get assistance for this service through your Pradhan eSeva account.", color = Ink)
                Spacer(Modifier.height(18.dp))
                Button(onClick = onLogin, modifier = Modifier.fillMaxWidth(), colors = ButtonDefaults.buttonColors(containerColor = Orange)) { Text("Sign in to continue") }
            }
        }
    }
}

@Composable
private fun OrdersScreen(context: android.content.Context, isLoggedIn: Boolean, onLogin: () -> Unit) {
    var bookings by remember { mutableStateOf<List<ApiBooking>>(emptyList()) }
    var error by remember { mutableStateOf("") }
    LaunchedEffect(isLoggedIn) {
        if (isLoggedIn) try { bookings = PdsApi.bookings(context) } catch (e: Exception) { error = e.message ?: "Could not load orders" }
    }
    if (!isLoggedIn) EmptyState(Icons.Default.ReceiptLong, "Your orders will appear here", "Sign in to view application status and order history.", "Sign in", onLogin)
    else LazyColumn(Modifier.fillMaxSize(), contentPadding = PaddingValues(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
        item { Text("My Orders", fontSize = 24.sp, color = Navy, fontWeight = FontWeight.Bold) }
        if (error.isNotBlank()) item { Text(error, color = Color(0xFFB42318)) }
        items(bookings.size) { i ->
            Surface(color = Color.White, shape = RoundedCornerShape(14.dp), modifier = Modifier.fillMaxWidth()) {
                Column(Modifier.padding(16.dp)) {
                    Text(bookings[i].serviceName, color = Navy, fontWeight = FontWeight.Bold)
                    Text("Status: " + bookings[i].status, color = Muted, fontSize = 12.sp)
                    Text(bookings[i].createdAt.take(10), color = Muted, fontSize = 11.sp)
                }
            }
        }
        if (bookings.isEmpty() && error.isBlank()) item { Text("No orders found yet.", color = Muted) }
    }
}

@Composable
private fun AccountScreen(userName: String, isLoggedIn: Boolean, onLogin: () -> Unit, onLogout: () -> Unit) {
    Column(Modifier.fillMaxSize().padding(18.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("My Account", fontSize = 24.sp, color = Navy, fontWeight = FontWeight.Bold)
        Surface(color = Color.White, shape = RoundedCornerShape(18.dp), modifier = Modifier.fillMaxWidth()) {
            Column(Modifier.padding(18.dp)) {
                Icon(Icons.Default.AccountCircle, null, tint = Navy, modifier = Modifier.size(48.dp))
                Spacer(Modifier.height(8.dp))
                Text(if (isLoggedIn) "Hello, " + userName else "Welcome to Pradhan eSeva", fontWeight = FontWeight.Bold, fontSize = 17.sp)
                Text(if (isLoggedIn) "Your account is connected." else "Sign in to manage your profile and services.", color = Muted, fontSize = 13.sp)
                Spacer(Modifier.height(14.dp))
                Button(onClick = if (isLoggedIn) onLogout else onLogin, modifier = Modifier.fillMaxWidth(), colors = ButtonDefaults.buttonColors(containerColor = Orange)) { Text(if (isLoggedIn) "Sign out" else "Login / Register") }
            }
        }
        listOf("Profile details", "Saved documents", "Payment history", "Help & support", "Privacy policy").forEach {
            Row(Modifier.fillMaxWidth().background(Color.White, RoundedCornerShape(12.dp)).padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                Text(it, modifier = Modifier.weight(1f), fontWeight = FontWeight.Medium)
                Icon(Icons.Default.ChevronRight, null, tint = Muted)
            }
        }
    }
}

@Composable
private fun LoginScreen(onBack: () -> Unit, onLogin: (String, String) -> Unit, error: String) {
    var mobile by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    Column(Modifier.fillMaxSize().padding(22.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
        Text("‹  Back", color = Navy, fontWeight = FontWeight.Bold, modifier = Modifier.clickable { onBack() })
        Spacer(Modifier.height(12.dp))
        Text("Welcome back", fontSize = 26.sp, fontWeight = FontWeight.ExtraBold, color = Navy)
        Text("Sign in to your Pradhan eSeva account", color = Muted)
        OutlinedTextField(mobile, { mobile = it.filter(Char::isDigit).take(10) }, modifier = Modifier.fillMaxWidth(), label = { Text("Mobile number") }, leadingIcon = { Icon(Icons.Default.Phone, null) }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone), singleLine = true)
        OutlinedTextField(password, { password = it }, modifier = Modifier.fillMaxWidth(), label = { Text("Password") }, leadingIcon = { Icon(Icons.Default.Lock, null) }, visualTransformation = PasswordVisualTransformation(), singleLine = true)
        Button(onClick = { onLogin(mobile, password) }, modifier = Modifier.fillMaxWidth().height(50.dp), colors = ButtonDefaults.buttonColors(containerColor = Orange), enabled = mobile.length == 10 && password.isNotBlank()) { Text("Sign in") }
        if (error.isNotBlank()) Text(error, color = Color(0xFFB42318), fontSize = 12.sp)
    }
}

@Composable
private fun QuickTile(title: String, icon: androidx.compose.ui.graphics.vector.ImageVector, modifier: Modifier = Modifier, onClick: () -> Unit) {
    Surface(modifier.clickable(onClick = onClick), color = Color.White, shape = RoundedCornerShape(15.dp), shadowElevation = 1.dp) {
        Column(Modifier.padding(vertical = 14.dp, horizontal = 8.dp), horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(icon, null, tint = Orange, modifier = Modifier.size(25.dp))
            Spacer(Modifier.height(7.dp))
            Text(title, color = Navy, fontWeight = FontWeight.SemiBold, fontSize = 10.sp)
        }
    }
}

@Composable
private fun SectionHeading(title: String, action: String, onClick: () -> Unit) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Text(title, color = Navy, fontSize = 18.sp, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1f))
        Text(action, color = Orange, fontSize = 12.sp, fontWeight = FontWeight.Bold, modifier = Modifier.clickable { onClick() })
    }
}

@Composable
private fun ServiceRow(title: String, subtitle: String, onClick: () -> Unit) {
    Surface(color = Color.White, shape = RoundedCornerShape(14.dp), modifier = Modifier.fillMaxWidth().clickable { onClick() }, shadowElevation = 1.dp) {
        Row(Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(Modifier.size(42.dp).background(Color(0xFFFFF0E2), RoundedCornerShape(12.dp)), contentAlignment = Alignment.Center) {
                Icon(Icons.Default.Description, null, tint = Orange)
            }
            Spacer(Modifier.width(12.dp))
            Column(Modifier.weight(1f)) {
                Text(title, fontWeight = FontWeight.Bold, color = Navy, fontSize = 14.sp)
                Text(subtitle, color = Muted, fontSize = 11.sp)
            }
            Icon(Icons.Default.ChevronRight, null, tint = Muted)
        }
    }
}

@Composable
private fun EmptyState(icon: androidx.compose.ui.graphics.vector.ImageVector, title: String, subtitle: String, action: String, onClick: () -> Unit) {
    Column(Modifier.fillMaxSize().padding(28.dp), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
        Box(Modifier.size(76.dp).background(Color(0xFFFFEBD9), CircleShape), contentAlignment = Alignment.Center) { Icon(icon, null, tint = Orange, modifier = Modifier.size(36.dp)) }
        Spacer(Modifier.height(18.dp))
        Text(title, color = Navy, fontWeight = FontWeight.Bold, fontSize = 18.sp)
        Spacer(Modifier.height(6.dp))
        Text(subtitle, color = Muted, fontSize = 13.sp)
        Spacer(Modifier.height(18.dp))
        Button(onClick = onClick, colors = ButtonDefaults.buttonColors(containerColor = Orange)) { Text(action) }
    }
}
