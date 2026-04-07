extends Node2D


func _ready()->void:
	pass

func _connect_test() -> void:
	Firebase.Auth.login_anonymous() # will have to replace with actual auth
	var collection: FirestoreCollection = Firebase.Firestore.collection('Users') # connect to specific collection
	#var document = await collection.add("", {'name': 'test', 'active': 'true'})
	var get = await collection.get_doc('test') # example of a get
	print(get)
