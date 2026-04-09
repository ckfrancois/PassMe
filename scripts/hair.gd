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
	hair_keys = Global.hairO_collection.keys()

# Update textures and modulate
func update_sprite():
	var current_sprite = hair_keys[current_hair_index]
	if current_sprite == "none":
		hairO_sprite.texture = null
		hairC_sprite.texture = null
	else:
		hairO_sprite.texture = Global.hairO_collection[current_sprite]
		hairC_sprite.texture = Global.hairC_collection[current_sprite]
		hairC_sprite.modulate = Global.hair_colors[current_color_index]
	
	Global.selected_hair = current_sprite
	Global.selected_hair_color = Global.hair_colors[current_color_index]


func _on_collection_button_pressed() -> void:
	current_hair_index = (current_hair_index + 1) % hair_keys.size()
	update_sprite()


func _on_color_button_pressed() -> void:
	current_color_index = (current_color_index + 1) % Global.hair_colors.size()
	update_sprite()
