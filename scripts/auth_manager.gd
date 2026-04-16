extends Node

var firebase_token:String =  ""
var project_id:String = ""
var user_uid:String = ""

var user_display_name:String = "Unknown"

#
#func _ready() -> void:
	#var json = { "name": "", 
	#"fields": { 
		#"outfit": { "stringValue": "10" }, 
		#"shoes": { "stringValue": "05" }, 
		#"outfit_color": { "stringValue": "(0.2157, 0.5608, 0.1725, 1.0)" }, 
		#"nose": { "stringValue": "05" }, 
		#"hair": { "stringValue": "03.1" }, 
		#"body_color": { "stringValue": "(0.9765, 0.898, 0.8706, 1.0)" }, 
		#"accessory": { "stringValue": "none" }, 
		#"legs": { "stringValue": "01" }, 
		#"eyebrow": { "stringValue": "05" }, 
		#"eye": { "stringValue": "02" }, 
		#"mouth": { "stringValue": "05" }, 
		#"hair_color": { "stringValue": "(0.3765, 0.1882, 0.1647, 1.0)" }, 
		#"legs_color": { "stringValue": "(0.8667, 0.4314, 0.0, 1.0)" }, 
		#"accessory_color": { "stringValue": "(0.8667, 0.4314, 0.0, 1.0)" }, 
		#"shoe_color": { "stringValue": "(0.8667, 0.4314, 0.0, 1.0)" } }, 
		#"createTime": "2026-04-15T19:22:06.284297Z", 
		#"updateTime": "2026-04-16T05:32:59.304658Z" }
	#var json = { "name": "", 
	#"fields": 
		#{ "shoe_color": { "stringValue": "(0.8667, 0.4314, 0.0, 1.0)" }, 
			#"outfit": { "stringValue": "01" }, 
			#"hair": { "stringValue": "01" }, 
			#"accessory_color": { "stringValue": "(0.8667, 0.4314, 0.0, 1.0)" }, 
			#"mouth": { "stringValue": "10" }, 
			#"accessory": { "stringValue": "none" }, 
			#"outfit_color": { "stringValue": "(0.3686, 0.1216, 0.7922, 1.0)" }, 
			#"nose": { "stringValue": "01" }, 
			#"legs": { "stringValue": "01" }, 
			#"legs_color": { "stringValue": "(0.8667, 0.4314, 0.0, 1.0)" }, 
			#"shoes": { "stringValue": "none" }, 
			#"eye": { "stringValue": "14" }, 
			#"body_color": { "stringValue": "(0.9765, 0.898, 0.8706, 1.0)" }, 
			#"eyebrow": { "stringValue": "05" }, 
			#"hair_color": { "stringValue": "(0.3686, 0.1216, 0.7922, 1.0)" } }, 
			#"createTime": "2026-04-15T19:22:06.284297Z", 
			#"updateTime": "2026-04-15T20:23:34.832301Z" }
	#update_passling_based_on_previous_data(json)

signal got_display_name(display_name:String)

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
	_fetch_passling_data()
	_fetch_user_data()


func parse_color_string(color_string: String) -> Color:
	var cleaned = color_string.strip_edges().trim_prefix("(").trim_suffix(")")
	var parts = cleaned.split(",")
	return Color(
		parts[0].strip_edges().to_float(),
		parts[1].strip_edges().to_float(),
		parts[2].strip_edges().to_float(),
		parts[3].strip_edges().to_float()
	)


func _fetch_user_data():
	print("FETCHING USER DATA ")
	var url = "https://firestore.googleapis.com/v1/projects/%s/databases/(default)/documents/Users/%s" % [project_id, user_uid]

	var headers = [
		"Authorization: Bearer %s" % firebase_token,
		"Accept: application/json"
	]

	var http = HTTPRequest.new()
	add_child(http)

	http.request_completed.connect(_on_user_get_request_completed)

	var err = http.request(url, headers, HTTPClient.METHOD_GET)

	if err != OK:
		print("HTTP error:", err)


func _on_user_get_request_completed(result, response_code, headers, body):
	if response_code == 200:
		var json = JSON.parse_string(body.get_string_from_utf8())
		print("✅ Firebase Data:", json)
		user_display_name = json.fields.displayName.stringValue
		got_display_name.emit(user_display_name)
	else:
		print("❌ Firebase Error:", response_code)
		print(body.get_string_from_utf8())


func _fetch_passling_data():
	var url = "https://firestore.googleapis.com/v1/projects/%s/databases/(default)/documents/Passlings/%s" % [project_id, user_uid]
	
	var headers = [
		"Authorization: Bearer %s" % firebase_token,
		"Accept: application/json"
	]
	
	var http = HTTPRequest.new()
	add_child(http)
	
	http.request_completed.connect(_on_passling_get_request_completed)
	
	var err = http.request(url, headers, HTTPClient.METHOD_GET)
	
	if err != OK:
		print("HTTP error:", err)



func _on_passling_get_request_completed(result, response_code, headers, body):
	if response_code == 200:
		var json = JSON.parse_string(body.get_string_from_utf8())
		print("✅ Firebase Data:", json)
		update_passling_based_on_previous_data(json)
	else:
		print("❌ Firebase Error:", response_code)
		print(body.get_string_from_utf8())


func update_passling_based_on_previous_data(json):
	var fields = json.fields
	print("Fields: ",fields)
	Global.selected_accessory = fields.accessory.stringValue
	Global.selected_eyebrow = fields.eyebrow.stringValue
	Global.selected_body_color = parse_color_string(fields.body_color.stringValue)
	Global.selected_accessory_color = parse_color_string(fields.accessory_color.stringValue)
	Global.selected_eye = fields.eye.stringValue
	Global.selected_hair = fields.hair.stringValue
	Global.selected_hair_color = parse_color_string(fields.hair_color.stringValue)
	Global.selected_legs = fields.legs.stringValue
	Global.selected_legs_color = parse_color_string(fields.legs_color.stringValue)
	Global.selected_mouth = fields.mouth.stringValue
	Global.selected_nose = fields.nose.stringValue
	Global.selected_outfit = fields.outfit.stringValue
	Global.selected_outfit_color = parse_color_string(fields.outfit_color.stringValue)
	Global.selected_shoe = fields.shoes.stringValue
	Global.selected_shoe_color = parse_color_string(fields.shoe_color.stringValue)
	
	print("Selected Hair: ", Global.selected_hair)
	
	print("HAIR COLORS: ", Global.hair_colors)
	
	update_all_on_hair(get_tree().current_scene.get_node("Skeleton"))
	update_all_on_body(get_tree().current_scene.get_node("Skeleton/Body"))
	update_all_on_accessory(get_tree().current_scene.get_node("Skeleton/Accessory"))
	
	print("Selected Accessory: ", Global.selected_accessory)
	print("Selected Eye ", Global.selected_eye)
	print("Selected Body Color ", Global.selected_body_color)

# Load the accessory data from database
func update_all_on_accessory(accessory:Node2D):
	accessory.current_color_index = find_closest_index(Global.selected_accessory_color, Global.colors)
	accessory.current_accessory_index = int(Global.selected_accessory)
	#await accessory.ready
	accessory.update_accessory()

# Load the hair data from database
func update_all_on_hair(hair:Node2D):
	hair.current_hair_index = Global.hairO_collection.keys().find(Global.selected_hair)
	hair.current_eyebrow_index = int(Global.selected_eyebrow)-1
	hair.current_color_index = find_closest_index(Global.selected_hair_color, Global.hair_colors)
	
	#await hair.ready
	hair.update_hair()
	hair.update_eyebrow()

# Load the body data from database
func update_all_on_body(body):
	body.current_eye_index = int(Global.selected_eye)-1
	body.current_nose_index = int(Global.selected_nose)-1
	body.current_mouth_index = int(Global.selected_mouth)-1
	body.current_outfit_index = int(Global.selected_outfit)-1
	body.current_outfit_color_index = find_closest_index(Global.selected_outfit_color, Global.colors)
	body.current_leg_index = int(Global.selected_legs)-1
	body.current_leg_color_index = find_closest_index(Global.selected_legs_color, Global.colors)
	body.current_shoe_index = int(Global.selected_shoe)-1
	body.current_shoe_color_index = find_closest_index(Global.selected_shoe_color, Global.colors)
	body.current_body_index = find_closest_index(Global.selected_body_color, Global.body_colors)
	#await body.ready
	body.update_body_sprite()
	body.update_eye_sprite()
	body.update_nose_sprite()
	body.update_mouth_sprite()
	body.update_outfit_sprite()
	body.update_leg_sprite()
	body.update_shoe_sprite()


func find_closest_index(target: Color, palette: Array) -> int:
	var best_index := 0
	var best_dist := INF
	for i in palette.size():
		var dist = target.to_rgba32() ^ palette[i].to_rgba32()  # fallback: use float diff
		dist = sqrt(
			pow(target.r - palette[i].r, 2) +
			pow(target.g - palette[i].g, 2) +
			pow(target.b - palette[i].b, 2) +
			pow(target.a - palette[i].a, 2)
			)
		if dist < best_dist:
			best_dist = dist
			best_index = i
	return best_index


func _on_request_completed(result, response_code, headers, body):
	if response_code == 200:
		var json = JSON.parse_string(body.get_string_from_utf8())
		print("✅ Firebase Data:", json)
	else:
		print("❌ Firebase Error:", response_code)
		print(body.get_string_from_utf8())



func set_passling_data():
	print("Setting Data")
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
