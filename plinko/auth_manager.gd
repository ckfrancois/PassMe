extends Node

var firebase_token:String = ""
var project_id:String = ""
var user_uid:String = ""

var passling_url:String = "https://firestore.googleapis.com/v1/projects/%s/database/(default)/documents/Passlings/%s" % [project_id, user_uid]
var user_url:String = "https://firestore.googleapis.com/v1/projects/%s/database/(default)/documents/Users/%s" % [project_id, user_uid]


var passed_data:Array = []:
	set(new_array):
		passed_data = new_array
		print(new_array)


func set_uid(uid:String) -> void:
	user_uid = uid
	print("User UID: ", uid)

func set_project_id(id:String) -> void:
	project_id = id
	print("Project ID: ", id)

func set_token(token:String) -> void:
	firebase_token = token
	print("Recieved Token: ", token)
	
	fetch_passed_data()


func fetch_passed_data() -> void:
	
	var headers = [
		"Authorization: Bearer %s" % firebase_token,
		"Accept: application/json"
	]
	
	var http:HTTPRequest = HTTPRequest.new()
	add_child(http)
	
	http.request_completed.connect(_on_request_completed)
	
	var err = http.request(user_url, headers, HTTPClient.METHOD_GET)
	
	if err != OK:
		print("HTTP error:", err)
	




func _on_request_completed(result, response_code, headers, body) -> void:
	if response_code == 200:
		var json = JSON.parse_string(body.get_string_from_utf8())
		print("Firebase Data: ", json)
		print(json.fields.usersPassed)
		
	else:
		print("FIREBASE ERROR: ", response_code)
		print(body.get_string_from_utf8())

func fetch_passling_data() -> void:
	pass
