extends Node

var firebase_token:String =  ""
var project_id:String = ""
var user_uid:String = ""


func set_uid(uid):
	user_uid = uid
	print("User UID: ", user_uid)

func set_project_id(id):
	project_id = id
	print("Project ID: ", project_id)

func set_token_from_js(token):
	print("TOKEN", token)
	set_token(token)

func set_token(token: String) -> void:
	print("✅ Received token from React Native: ", token)
	firebase_token = token
	
	# OPTIONAL: decode / use immediately
	_fetch_user_data()


func _fetch_user_data():
	var url = "https://firestore.googleapis.com/v1/projects/%s/databases/(default)/documents/Users/%s" % [project_id, user_uid]

	var headers = [
		"Authorization: Bearer %s" % firebase_token,
		"Accept: application/json"
	]

	var http = HTTPRequest.new()
	add_child(http)

	http.request_completed.connect(_on_request_completed)

	var err = http.request(url, headers, HTTPClient.METHOD_GET)

	if err != OK:
		print("HTTP error:", err)
	

func _on_request_completed(result, response_code, headers, body):
	if response_code == 200:
		var json = JSON.parse_string(body.get_string_from_utf8())
		print("✅ Firebase Data:", json)
	else:
		print("❌ Firebase Error:", response_code)
		print(body.get_string_from_utf8())

func update_passling_data(): 
	
	var passling_doc:Dictionary = {
		"accessory":Global.selected_accessory,
		"eyebrow":Global.selected_eyebrow,
		"eye":Global.selected_eye,
		"nose":Global.selected_nose,
		"mouth":Global.selected_mouth,
		"hair":Global.selected_hair,
		"outfit":Global.selected_outfit,
		"legs":Global.selected_legs,
		"shoes":Global.selected_shoe,
		"accessory_color":Global.selected_accessory_color,
		"body_color":Global.selected_body_color,
		"hair_color":Global.selected_hair_color,
		"outfit_color":Global.selected_outfit_color,
		"legs_color":Global.selected_legs_color,
		"shoe_color":Global.selected_shoe_color
	}
	
	print("Selected Accessory:", Global.selected_accessory)
	#await passling_collection.set_doc('kjsafbhkjsdgf', passling_doc)


func set_passling_data():
	var url = "https://firestore.googleapis.com/v1/projects/%s/databases/(default)/documents/Passlings/%s" % [project_id, user_uid]

	var headers = [
		"Authorization: Bearer %s" % firebase_token,
		"Content-Type: application/json"
	]
	var body = {
		"fields": {
			"accessory": {"stringValue": str(Global.selected_accessory)},
			"eyebrow": {"stringValue": str(Global.selected_eyebrow)},
			"eye": {"stringValue": str(Global.selected_eye)},
			"nose": {"stringValue": str(Global.selected_nose)},
			"mouth": {"stringValue": str(Global.selected_mouth)},
			"hair": {"stringValue": str(Global.selected_hair)},
			"outfit": {"stringValue": str(Global.selected_outfit)},
			"legs": {"stringValue": str(Global.selected_legs)},
			"shoes": {"stringValue": str(Global.selected_shoe)},
			"accessory_color": {"stringValue": str(Global.selected_accessory_color)},
			"body_color": {"stringValue": str(Global.selected_body_color)},
			"hair_color": {"stringValue": str(Global.selected_hair_color)},
			"outfit_color": {"stringValue": str(Global.selected_outfit_color)},
			"legs_color": {"stringValue": str(Global.selected_legs_color)},
			"shoe_color": {"stringValue": str(Global.selected_shoe_color)}
		}
	}

	var http = HTTPRequest.new()
	add_child(http)

	http.request_completed.connect(_on_request_completed)

	var err = http.request(url, headers, HTTPClient.METHOD_PATCH, JSON.stringify(body))

	if err != OK:
		print("❌ Failed request:", err)
