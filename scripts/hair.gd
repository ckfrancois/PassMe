extends Node2D

@onready var hairC_sprite = $Hair/Color
@onready var hairO_sprite = $Hair/Outline

@onready var hair_backC_sprite = $Hair_Back/Color
@onready var hair_backO_sprite = $Hair_Back/Outline

@onready var eyebrow_sprite = $Hair/Eyebrows

@export var eyebrow_buttons: ButtonGroup
@export var hair_buttons: ButtonGroup

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
	eyebrow_buttons.pressed.connect(_on_eyebrow_group_pressed)
	hair_buttons.pressed.connect(_on_hair_group_pressed)

func set_sprite_keys():
	hair_keys = Global.hairO_collection.keys()
	eyebrow_keys = Global.eyebrow_collection.keys()

# Update hair textures and modulate
func update_hair():
	var current_sprite = hair_keys[current_hair_index]
	print("Current_sprite is ", current_sprite)
	if current_sprite == "none":
		hairO_sprite.texture = null
		hairC_sprite.texture = null
		hair_backO_sprite.texture = null
		hair_backC_sprite.texture = null
	else:
		hairO_sprite.texture = Global.hairO_collection[current_sprite]
		hairC_sprite.texture = Global.hairC_collection[current_sprite]
		hairC_sprite.modulate = Global.hair_colors[current_color_index]
		if Global.hair_backC_collection.has(current_sprite):
			hair_backO_sprite.texture = Global.hair_backO_collection[current_sprite]
			hair_backC_sprite.texture = Global.hair_backC_collection[current_sprite]
			hair_backC_sprite.modulate = Global.hair_colors[current_color_index]
		else:
			hair_backO_sprite.texture = null
			hair_backC_sprite.texture = null
			
	
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


func _on_eyebrow_group_pressed(button: BaseButton):
	var button_pressed = eyebrow_buttons.get_pressed_button()
	current_eyebrow_index = int(button_pressed.name) - 1
	update_eyebrow()

func _on_hair_group_pressed(button: BaseButton):
	var button_pressed = hair_buttons.get_pressed_button()
	current_hair_index = int(button_pressed.name) - 1
	update_hair()
