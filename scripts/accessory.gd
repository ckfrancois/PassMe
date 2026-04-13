extends Node2D

@onready var accessoryC_sprite = $Color
@onready var accessoryO_sprite = $Outline

# Keys
var accessory_keys = []
var current_color_index = 0
var current_accessory_index = 0

func _ready():
	set_sprite_keys()
	update_accessory()

func set_sprite_keys():
	accessory_keys = Global.accessoryO_collection.keys()

# Update accessory textures and modulate
func update_accessory():
	var current_sprite = accessory_keys[current_accessory_index]
	if current_sprite == "none":
		accessoryO_sprite.texture = null
		accessoryC_sprite.texture = null
	else:
		accessoryO_sprite.texture = Global.accessoryO_collection[current_sprite]
		if Global.accessoryC_collection.has(current_sprite):
			accessoryC_sprite.texture = Global.accessoryC_collection[current_sprite]
			accessoryC_sprite.modulate = Global.colors[current_color_index]
		else:
			accessoryC_sprite.texture = null
			
	
	Global.selected_accessory = current_sprite
	Global.selected_accessory_color = Global.colors[current_color_index]	



func _on_collection_button_pressed() -> void:
	current_accessory_index = (current_accessory_index + 1) % accessory_keys.size()
	update_accessory()


func _on_color_button_pressed() -> void:
	current_color_index = (current_color_index + 1) % Global.colors.size()
	update_accessory()
