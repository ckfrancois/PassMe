extends Node


@export var confirm_button:Button = null


func _ready()->void:
	confirm_button.connect("pressed", AuthManager.set_passling_data)
