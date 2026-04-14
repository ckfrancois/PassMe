extends Node

@export var passling:Node2D = null

@export var confirm_button:Button = null

func _ready()->void:
	confirm_button.connect("pressed", _connect_test)

func _connect_test() -> void:
	Firebase.Auth.login_anonymous() # will have to replace with actual auth
	var passling_collection: FirestoreCollection = Firebase.Firestore.collection('Passlings') # connect to specific collection
	var users_collection: FirestoreCollection = Firebase.Firestore.collection('Users')
	
	#await passling_collection.set_doc("New User", {"name": "Test Name"})
	
	#var document = await collection.add("", {'name': 'test', 'active': 'true'})
	var document = await users_collection.get_doc('l7h92PD7t2k9r8KbayAp')# example of a get
	print(document)
	
	document["displayname"] = "CoolestJoe" # example of an update
	document["passling"] = "No Passling"
	var update = await users_collection.update(document)
	
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
	
	print("Current Hair Key:", passling.current_hair_index)
	print("Selected Accessory:", Global.selected_accessory)
	await passling_collection.set_doc('l7h92PD7t2k9r8KbayAp', passling_doc)
