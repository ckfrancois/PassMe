extends Node


@export var confirm_button:Button = null

@export var introduction_label:Label = null

func _ready()->void:
	confirm_button.connect("pressed", AuthManager.set_passling_data)
	AuthManager.got_display_name.connect(_write_introduction_label)
	introduction_label.text = "Hi! I'm \n"

func _write_introduction_label(display_name:String) -> void:
	introduction_label.text = "Hi! I'm\n" + display_name + ""
