extends Node2D

@onready var hairC_sprite = $Color
@onready var hairO_sprite = $Outline

# Keys
var hair_keys = []
var color_keys = 0
var current_color_index = 0
var current_hair_index = 0

func _ready():
	set_sprite_keys()
	update_sprite()

func set_sprite_keys():
	hair_keys = Global.hair_collection.keys()

# Update textures and modulate
func update_sprite():
	var current_sprite = hair_keys[current_hair_index]
	if current_sprite == "none":
		hairO_sprite.texture = null
		hairC_sprite.texture = null
	else:
		hairO_sprite.texture = Global.hair_collection[current_sprite]
		hairC_sprite.modulate = Global.hair_color_options[current_color_index]
	
	Global.selected_hair = current_sprite
	Global.selected_hair_color = Global.hair_color_options[current_color_index]
