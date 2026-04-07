extends Node2D


func _ready()->void:
	_connect_test()

func _connect_test() -> void:
	Firebase.Auth.login_anonymous() # will have to replace with actual auth
	var collection: FirestoreCollection = Firebase.Firestore.collection('Users') # connect to specific collection
	#var document = await collection.add("", {'name': 'test', 'active': 'true'})
	var document = await collection.get_doc('l7h92PD7t2k9r8KbayAp') # example of a get
	print(document)
	
	document["displayname"] = "JoelIsCoolest" # example of an update
	var update = await collection.update(document) 
