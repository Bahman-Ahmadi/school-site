function getJDatetime() {
	// getting local full date & time
	var result = new Date().toLocaleString();
	// replacement persian numbers to the latina numbers
	result = result.replace(/ /g, "").replace(/۰/g,"0").replace(/۱/g, "1").replace(/۲/g, "2").replace(/۳/g, "3").replace(/۴/g, "4").replace(/۵/g, "5").replace(/۶/g, "6").replace(/۷/g, "7").replace(/۸/g, "8").replace(/۹/g, "9");

	return result.split("،");
}

/***** USER FUNCTIONS *****/
/** works with users.json **/

function userIsExist(code, func) {
	// is exist any user with the code equal with <code> ?
	$.get("dist/dbs/users.json", (data, status) => {
		for (var user of data) {
			if (code == user.code) {
				return func(true);
			}
		}
		return func(false);
	});
}

function addUser(fname, lname, code, type) {
	// increase a user to the users.json
	$.get("dist/dbs/users.json", (data, status) => {
		data.push({"fname": fname, "lname": lname, "code": code, "type": type});
		$.get(`dbctrl.php?users=${data}`, (data, status) => {});
	});
}

function getUser(code, func) {
	// getting information of a user
	$.get("dist/dbs/users.json", (data, status) => {
		for (var user of data) {
			if (code == user.code) {
				return func(user);
			}
		}
	});
}

function editUser(code, key, value) {
	// edit some attribute from a user
	$.get("dist/dbs/users.json", (data, status) => {
		var i = 0;
		for (var user of data) {
			if (user.code == code) {
				data[i][key] = value;
				break;
			}
			i++;
		}
		$.get(`dbctrl.php?users=${data}`, (data, status) => {});
	});
}

function deleteUser(code) {
	// delete a user from users.json
	$.get("dist/dbs/users.json", (data, status) => {
		getUser(code, (user) => {
			data.pop(user);
			$.get(`dbctrl.php?users=${data}`, (data, status) => {});
		});
	});
}

/***** MESSAGES FUNCTIONS *****/
/** works with messages.json **/

function sendMessage(content, metadata, date, time, author) {
	// send a message and save it to messages.json
	$.get("dist/dbs/messages.json", (data, status) => {
		data.push({"content": content, "metadata": metadata, "date": date, "time": time, "author": author});
		$.get(`dbctrl.php?messages=${data}`, (data, status) => {});
	});
}

function getMessageInfo(MessageID, func) {
	// get information of a message
	$.get("dist/dbs/messages.json", (data, status) => {
		func(data[MessageID]);
	});
}

function editMessage(MessageID, key, value) {
	// edit a message by MessageID (MessageID: it's index of target message)
	$.get("dist/dbs/messages.json", (data, status) => {
		data[MessageID][key] = value;
		$.get(`dbctrl.php?messages=${data}`, (data, status) => {});
	});
}

function deleteMessage(MessageID) {
	// deleting message
	$.get("dist/dbs/messages.json", (data, status) => {
		data.pop(MessageID);
		$.get(`dbctrl.php?messages=${data}`, (data, status) => {});
	});
}

/***** BOOKS FUNCTIONS *****/
/** works with books.json **/

function addBook(photo, name, author, publication) {
	// add a book to the books.json
	$.get("dist/dbs/books.json", (data, status) => {
		data.push({"photo": photo, "name": name, "author": author, "publication": publication});
		$.get(`dbctrl.php?books=${data}`, (data, status) => {});
	});
}

function getBook(BookID, func) {
	// get a book by BookID (BookID: Index of the target book in books)
	$.get("dist/dbs/books.json", (data, status) => {
		func(data[BookID]);
	});
}

function editBook(BookID, key, value) {
	// edit the book by BookID
	$.get("dist/dbs/books.json", (data, status) => {
		data[BookID][key] = value;
		$.get(`dbctrl.php?books=${data}`, (data, status) => {});
	});
}

function deleteBook(BookID) {
	// delete a book by BookID
	$.get("dist/dbs/books.json", (data, status) => {
		data.pop(BookID);
		$.get(`dbctrl.php?books=${data}`, (data, status) => {});
	});
}

/***** CLASSROOMS FUNCTIONS *****/
/** works with classrooms.json **/

function checkClassroomType(number) {
	// TODO: adding real tajrobi classrooms
	var tajrobi = [203, 303, 403];
	var result = [200 < number < 300 ? 10 : 300 < 400 ? 11 : 12, tajrobi.indexOf(number) != -1 ? "tajrobi" : "riazi"];
	return result;
}

function addClassroom(number, type, students, teachers, program) {
	// add a classroom
	$.get("dist/dbs/classrooms.json", (data, status) => {
		data.push({"number": number, "type": checkClassroomType(number)[1], "students": [], "teachers": {}, "program": {"شنبه": [], "یکشنبه": [], "دوشنبه": [], "سه‌شنبه": [], "چهارشنبه": [], "پنج‌شنبه": []}});
		$.get(`dbctrl.php?classrooms=${data}`, (data, status) => {});
	});
}

function getClassroom(number, func) {
	// get details of a classroom
	$.get("dist/dbs/classrooms.json", (data, status) => {
		for (var classroom of data) {
			console.log(classroom.number, number, classroom.number == number);
			if (classroom.number == number) {
				return func(classroom);
			}
		}
		return undefined;
	});
}

function editClassroom(number, key, value) {
	// edit attributes of a classroom by number of that classroom
	$.get("dist/dbs/classrooms.json", (data, status) => {
		var i = 0;
		for (var classroom of data) {
			if (classroom.number == number) {
				classrooms[i][key] = value;
				break;
			}
			i++;
		}
		$.get(`dbctrl.php?classrooms=${data}`, (data, status) => {});
	});
}

function deleteClassroom(number) {
	// deleting classrooms is possible using function
	$.get("dist/dbs/classrooms.json", (data, status) => {
		for (var classroom of data) {
			if (classroom.number == number) {
				data.pop(classroom);
				$.get(`dbctrl.php?classrooms=${data}`, (data, status) => {});
			}
		}
	});
}

/***** STUDENT-PANEL FUNCTIONS *****/
/** works with students.json **/

function addStudent(fname, lname, code, father, classroom) {
	// add a saved user as a student
	userIsExist(code, (isExist) => {
		if (isExist) {
			$.get("dist/dbs/students.json", (data, status) => {
				var classType = checkClassroomType(classroom);
				// TODO : write lessons of every School-Year for <credit>
				data.push({"fname": fname, "lname": lname, "father": father, "class": classroom, "credit": classType[0] == 10 && classType[1] == "riazi" ? {"lessonsOf": "DAHOM RIAZI"} : classType[0] == 10 && classType[1] == "tajrobi" ? {"lessonsOf": "DAHOM TAJROBI"} : classType[0] == 11 && classType[1] == "riazi" ? {"lessonsOf": "YAZDAHOM RIAZI"} : classType[0] == 11 && classType[1] == "tajrobi" ? {"lessonsOf": "YAZDAHOM TAJROBI"} : classType[0] == 12 && classType[1] == "riazi" ? {"lessonsOf": "DAVAZDAHOM RIAZI"} : classType[0] == 12 && classType[1] == "tajrobi" ? {"lessonsOf": "DAVAZDAHOM TAJROBI"} : {}, "library": [], "code": code, "notifications": [{"time": getJDatetime().join(' '), "text": "حساب کاربری شما ایجاد شد"}]});
				$.get(`dbctrl.php?students=${data}`, (data, status) => {});
				getClassroom(classroom, (classInfo) => {
					editClassroom(classroom, "students", (classInfo.students  +  [, code]).split(","));
				});
			});
		} else {
			addUser(fname, lname, "student");
			addStudent(fname, lname, code, father, classroom);
		}
	});
}

function getStudent(code, func) {
	// get information of a student
	$.get("dist/dbs/students.json", (data, status) => {
		for (var student of data) {
			if (student.code == code) {
				return func(student);
			}
		}
	});
}

function editStudent(code, key, value) {
	// edit a student by the code
	$.get("dist/dbs/students.json", (data, status) => {
		var i = 0;
		for (var student of data) {
			if (student.code == code) {
				data[i][key] = value;
				break;
			}
			i++;
		}
		$.get(`dbctrl.php?students=${data}`, (data, status) => {});
	});
}

function deleteStudent(code) {
	// delete a student by the code
	$.get("dist/dbs/students.json", (data, status) => {
		for (var student of data) {
			if (student.code == code) {
				data.pop(student);
			}
		}
		$.get(`dbctrl.php?students=${data}`, (data, status) => {});
	});
}

/***** TEACHER-PANEL FUNCTIONS *****/
/** works with students.json & admins.json **/

function addTeacher(fname, lname, code, classrooms) {
	// adding a teacher (or school employees)
	$.get("dist/dbs/teachers.json", (data, status) => {
		data.push({"fname": fname, "lname": lname, "code": code, "classrooms": classrooms, "notifications": [{"time": getJDatetime().join(' '), "text": "حساب کاربری شما ایجاد شد"}]});
		$.get(`dbctrl.php?teachers=${data}`, (data, status) => {});
	});
}

function getTeacher(code, func) {
	// get details of a teacher
	$.get("dist/dbs/teachers.json", (data, status) => {
		for (var teacher of data) {
			if (teacher.code == code) {
				return func(teacher);
			}
		}
	});
}

function editTeacher(code, key, value) {
	// edit attributes of a teacher
	$.get("dist/dbs/teachers.json", (data, status) => {
		var i = 0;
		for (var teacher of data) {
			if (teacher.code == code) {
				data[i][key] = value;
			}
			i++;
		}
		$.get(`dbctrl.php?teachers=${data}`, (data, status) => {});
	});
}

function deleteTeacher(code) {
	// deleting a teacher
	$.get("dist/dbs/teachers.json", (data, status) => {
		for (var teacher of data) {
			if (teacher.code == code) {
				data.pop(teacher);
			}
		}
		$.get(`dbctrl.php?teachers=${data}`, (data, status) => {});
	});
}

/***** DEVELOPER-PANEL FUNCTIONS *****/
/** works with all databases **/

function addLog(code, text) {
	// increase a log to logcat
	$.get("dist/dbs/logs.json", (data, status) => {
		data.push({"code": code, "time": getJDatetime(), "text": text});
		$.get(`dbctrl.php?logs=${data}`, (data, status) => {});
	});
}

function getLogs(func) {
	// get all logs
	$.get("dist/dbs/logs.json", (data, status) => {
		func(data);
	});
}

function deleteLog(logID) {
	// delete a log by index of that
	$.get("dist/dbs/logs.json", (data, status) => {
		data.pop(logID);
		$.get(`dbctrl.php?logs=${data}`, (data, status) => {});
	});
}