/**
 * MPSTME Lost & Found Portal - Core Logic
 */

var app = angular.module("LostFoundApp", ["ngRoute"]);

// --- 1. ROUTING & SECURITY GATEWAY ---
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl: "templates/home.html"
    })
    .when("/report", {
        templateUrl: "templates/report.html",
        controller: "ReportCtrl"
    })
    .when("/view", {
        templateUrl: "templates/view.html",
        controller: "ViewCtrl"
    })
    .when("/login", {
        templateUrl: "templates/login.html",
        controller: "LoginCtrl"
    })
    .when("/admin", {
        templateUrl: "templates/admin.html",
        controller: "AdminCtrl",
        resolve: {
            "check": function($location) {
                if (sessionStorage.getItem('isAdmin') !== 'true') {
                    $location.path('/login');
                }
            }
        }
    })
    .otherwise({
        redirectTo: "/"
    });
});

// --- 2. REPORT CONTROLLER ---
app.controller("ReportCtrl", function($scope, $http, $location) {
    $scope.item = { status: 'Lost' }; 

    $scope.submitForm = function() {
        var fd = new FormData();
        for (var key in $scope.item) {
            fd.append(key, $scope.item[key]);
        }
        
        var fileInput = document.getElementById('itemImage');
        if (fileInput && fileInput.files.length > 0) {
            fd.append('image', fileInput.files[0]);
        }

        $http.post("api/server.php?action=create", fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .then(function(response) {
            alert(response.data.message);
            $location.path('/view');
        });
    };
});

// --- 3. VIEW CONTROLLER (WhatsApp Notification Logic) ---
app.controller("ViewCtrl", function($scope, $http) {
    $scope.items = [];
    $scope.searchText = "";

    $scope.fetchItems = function() {
        $http.get("api/server.php?action=read")
        .then(function(response) {
            $scope.items = response.data;
        });
    };

    // SECURE WHATSAPP BRIDGE
    $scope.notifyOwner = function(item) {
        if(confirm("This will open WhatsApp to notify the owner of the " + item.item_name + ". Proceed?")) {
            
            // 1. Ask PHP for the contact number securely
            $http.post("api/server.php?action=get_contact", { id: item.id })
            .then(function(response) {
                var phone = response.data.phone;
                
                // 2. Format the message
                var text = "Hi! I'm reaching out via the MPSTME Lost & Found Portal. I've found your '" + 
                            item.item_name + "' at " + item.location + ". Let's coordinate a return!";
                
                // 3. Generate the Deep Link (91 for India prefix)
                var waLink = "https://wa.me/91" + phone + "?text=" + encodeURIComponent(text);
                
                // 4. Open in new tab
                window.open(waLink, '_blank');
            }, function() {
                alert("Error retrieving contact details.");
            });
        }
    };

    $scope.fetchItems(); 
});

// --- 4. LOGIN CONTROLLER ---
app.controller("LoginCtrl", function($scope, $location) {
    $scope.login = function() {
        if ($scope.adminPass === "NMIMS@2026") {
            sessionStorage.setItem('isAdmin', 'true');
            $location.path('/admin');
        } else {
            $scope.error = "Unauthorized access attempt.";
        }
    };
});

// --- 5. ADMIN CONTROLLER ---
app.controller("AdminCtrl", function($scope, $http, $location) {
    $scope.items = [];

    $scope.fetchItems = function() {
        $http.get("api/server.php?action=read").then(function(res) { $scope.items = res.data; });
    };

    $scope.deleteItem = function(id) {
        if (confirm("Delete this record permanently?")) {
            $http.get("api/server.php?action=delete&id=" + id).then(function(res) {
                alert(res.data.message);
                $scope.fetchItems(); 
            });
        }
    };

    $scope.markClaimed = function(item) {
        var updatedItem = angular.copy(item);
        updatedItem.status = 'Claimed';
        $http.post("api/server.php?action=update", updatedItem).then(function() {
            alert("Item marked as Claimed.");
            $scope.fetchItems(); 
        });
    };

    $scope.logout = function() {
        sessionStorage.clear();
        $location.path('/');
    };

    $scope.fetchItems();
});