extends Node2D

@onready var hairC_sprite = $Color
@onready var hairO_sprite = $Outline

@onready var eyebrow_sprite = $Eyebrows

# Keys
var hair_keys = []
var eyebrow_keys = []
var current_color_index = 0
var current_hair_index = 0
var current_eyebrow_index = 0

func _ready():
	set_sprite_keys()
	update_hair()
	update_eyebrow()

func set_sprite_keys():
	hair_keys = Global.hairO_collection.keys()
	eyebrow_keys = Global.eyebrow_collection.keys()

# Update hair textures and modulate
func update_hair():
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
	
# Update eyebrow textures
func update_eyebrow():
	var current_sprite = eyebrow_keys[current_eyebrow_index]
	if current_sprite == "none":
		eyebrow_sprite.texture = null
	else:
		eyebrow_sprite.texture = Global.eyebrow_collection[current_sprite]
	
	Global.selected_eyebrow = current_sprite


func _on_collection_button_pressed() -> void:
	current_hair_index = (current_hair_index + 1) % hair_keys.size()
	update_hair()


func _on_color_button_pressed() -> void:
	current_color_index = (current_color_index + 1) % Global.hair_colors.size()
	update_hair()


func _on_eyebrow_button_pressed() -> void:
	current_eyebrow_index = (current_eyebrow_index + 1) % eyebrow_keys.size()
	update_eyebrow()
