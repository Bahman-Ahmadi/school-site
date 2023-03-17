var app = angular.module('myApp', []);


app.controller('MessageController', function ($scope, $http) {
	 function getMessages() {
		$http.get("dist/dbs/messages.json").then(function (res) {
		 	var result = [];
			for (var i of res.data) {
				result.push(i);
				// applying styles
				//  result[result.length-1]["content"] = result[result.length-1]["content"].replace(/c/g, "C");
			}
			$scope.messages = result;
		});
	 }
	 setInterval(getMessages, 1000);
});

app.controller('StorageController', function ($scope) {
	$scope.storage = localStorage;
	getUser(getAccount().code, (user) => {
		localStorage.setItem("account", JSON.stringify(user));
	});
	$scope.account = getAccount();
});

app.controller('RegisterController', function ($scope) {
	$scope.checkCode = (code) => {
		getUser(code, (user) => {
			localStorage.setItem('account', JSON.stringify(user));
			goto(user.type == "student" ? "userpanel.html" : user.type == "developerpanel" ? "developerpanel.html" : "adminpanel.html");
		});
	};
});

app.controller('BookController', function ($scope, $http) {
	$http.get("dist/dbs/books.json").then(function (res) {
		$scope.books = res.data;
	});
});

app.controller('StudentController', function ($scope, $http) {
	$http.get("dist/dbs/students.json").then(function (res) {
		for (var student of res.data) {
			if (getAccount().code == student.code) {
				var classinfo = checkClassroomType(student['class']);
				$scope.student = student;
				$scope.student.classnum = classinfo[0] == 10 ? 'دهم' : classinfo[0] == 11 ? 'یازدهم' : 'دوازدهم';
				$scope.student.classtype  = classinfo[1] == 'riazi' ? 'ریاضی' : 'تجربی';
				localStorage.setItem("classroom", student["class"]);
				break;
			}
	 	}
	 });
});

app.controller('ClassroomController', function ($scope, $http){
	$http.get("dist/dbs/classrooms.json").then(function (res) {
		for (var classroom of res.data) {
			if (classroom.number == localStorage.getItem("classroom")) {
				$scope.classroom = classroom;
				break;
			}
		}
	});
});

app.controller('StudentBooksController', function ($scope, $http) {
	$http.get("dist/dbs/books.json").then(function (bookRes) {
		$http.get("dist/dbs/students.json").then(function (studentRes) {
		 	$scope.results = [];
		 	for (var student of studentRes.data) {
				if (getAccount().code == student.code) {
					for (var book of student.library) {
						$scope.results.push([bookRes.data[book[0]], book[1]]);
					}
					break;
				}
		 	}
		});
	 });
});

app.controller('UsersController', function ($scope, $http) {
	$http.get("dist/dbs/users.json").then(function (res) {
		$scope.users = res.data;
	});
	$scope.deleteUser = (code) => {
		$http.get(`dist/dbs/users.json`).then(function(users){
			for (var user of users.data) {
				if (user.code == code) {
					users.data.pop(user);
					$http.get(`dbctrl.php?users=${JSON.stringify(users.data)}`);
					break;
				}
			}
		});
	};
});

app.controller('StudentsController', function ($scope, $http) {
	$http.get("dist/dbs/students.json").then(function (res) {
		$scope.students = res.data;
	});
	$scope.deleteStudent = (code) => {
		$http.get(`dist/dbs/students.json`).then(function(students){
			for (var student of students.data) {
				if (student.code == code) {
					students.data.pop(student);
					$http.get(`dbctrl.php?students=${JSON.stringify(students.data)}`);
					$scope.student.classnum = classinfo[0] == 10 ? 'دهم' : classinfo[0] == 11 ? 'یازدهم' : 'دوازدهم';
					$scope.student.classtype  = classinfo[1] == 'riazi' ? 'ریاضی' : 'تجربی';
					break;
				}
			}
		});
	};
	$scope.getStudent = (code) => {
		$http.get(`dist/dbs/students.json`).then(function(students){
			for (var student of students.data) {
				if (student.code == code) {
					var classinfo = checkClassroomType(student['class']);
					$scope.student = student;
					$scope.student.classnum = classinfo[0] == 10 ? 'دهم' : classinfo[0] == 11 ? 'یازدهم' : 'دوازدهم';
					$scope.student.classtype = classinfo[1] == 'riazi' ? 'ریاضی' : 'تجربی';
					$http.get(`dist/dbs/books.json`).then(function (res) {
						console.log(res);
					});
					break;
				}
			}
		});
	};
});

app.controller('LogsController', function ($scope, $http) {
	$http.get('dist/dbs/logs.json').then(function (res) {
		$scope.logs = res.data;
	});
});

app.controller('ThemeController', function ($scope, $http) {
	$http.get('dist/css/basestyles.css').then(function (res) {
		// css to json object
		var obj = res.data.replace(/ : /g, '":"').replace(/--/g, '"--').replace(/;\n/g, '",').replace(/:root /g, '').replace(/\n+|\t+/g,'').replace(/,}/g, '}').split(",");
		for (var i of obj) {
			obj[obj.indexOf(i)] = i.replace(/\"|\{|\}/g, '').split(":");
		}
		$scope.template = obj;
		var names = "";
		for (var j of obj) {
			names += `"${j[0]}",`;
		}
		names = names.split(",");
		names.pop(names.length - 1);
		$scope.names = names.join(",");
	});
	$scope.editTheme = function (ids) {
		ids = ids.replace(/"/g, "").split(",");
		var template = {};
		for (var id of ids) {template[id] = document.getElementById(id).value;}
		// convert JSON (object) to CSS code
		var css = JSON.stringify(template).replace(/":"/g, ' : ').replace(/"--/g, '--').replace(/","/g, ';\n').replace(/",/g, '; ').replace(/"}/g, "}");
		$http.get(`dbctrl.php?basestyles=:root ${css}`);
	};
});

app.controller('NotificationController', function ($scope, $http) {
	$scope.sendNotif = () => {
		$http.get(`dist/dbs/students.json`).then((res) => {
			var counter = 0;
			for (var student of res.data) {
				if (0 < student.class - $scope.notif_cats < 100){
					res.data[counter].notifications.push({"text": $scope.notif_text, "time": getJDatetime()});
				} else if ($scope.notif_cats == 500) {
					var selectableStudents = document.getElementsByClassName("selected-student");
					var selectedCodes = [];
					var innerCounter = 0;
					for (var ss of selectableStudents) {
						if (ss.checked) {
							selectedCodes.push(ss.id.split("_")[1]);
						}
					}
					$http.get(`dist/dbs/students.json`).then((res) => {
						for (var student of res.data) {
							if (selectedCodes.indexOf(student.code) != -1 ) {
								res.data[innerCounter].notifications.push({"text": $scope.notif_text, "time": getJDatetime()});
								break;
							}
							innerCounter++;
						}
						$http.get(`dbctrl.php?students=${JSON.stringify(res.data)}`);
					});
				} else {
					if (student.class == $scope.notif_cats) {
						res.data[counter].notifications.push({"text": $scope.notif_text, "time": getJDatetime()});
						break;
					}
				}
				$http.get(`dbctrl.php?students=${JSON.stringify(res.data)}`);
				counter++;
			}
		});
	};
});

$('.print').on('click', function () {window.print()});
$('.notifpanel').on('click', function () {$('.notifs').toggleClass("visibleNotifs")});
$('.site-title').on('click', function () {goto("/")});
$('.register-btn').on('click', function () {goto("register.html")});
$('.search-btn').on('click', function () {$('.search-bar').toggleClass("visibleSearch")});
$('.username').on('click', function () {go2panel()});
$('.bi-house').on('click', function () {goto("")});
$('.bi-pay').on('click', function () {goto("https://idpay.ir")});
$('.bi-book').on('click', function () {goto("library.html")});
$('.bi-person').on('click', function () {go2panel()});

function goto (URL, download=false) {
	try { document.getElementById("goto").href = ""; }
	catch (e) {}
	document.body.innerHTML += `<a href="${URL.indexOf('http') != -1 ? URL : URL != "" ? window.location.origin+'/'+URL : ""}" id="goto" ${download ? 'target="_blank" download' : ''}></a>`;
	document.getElementById("goto").click();
}
function getAccount() {
	return JSON.parse(localStorage.getItem("account"));
}
function go2panel () {
	getUser(getAccount().code, (user) => {
		goto(user.type == "student" ? "userpanel.html" : user.type == "developerpanel" ? "developerpanel.html" : "adminpanel.html");
	});
}