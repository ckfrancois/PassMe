extends Node2D

@onready var leftArmC_sprite = $LeftArm/Outfit_Color
@onready var leftArmO_sprite = $LeftArm/Outfit_Outline
@onready var rightArmC_sprite = $RightArm/Outfit_Color
@onready var rightArmO_sprite = $RightArm/Outfit_Outline
@onready var torsoC_sprite = $Torso/Outfit_Color
@onready var torsoO_sprite = $Torso/Outfit_Outline
@onready var headC_sprite = $Head/Outfit_Color
@onready var headO_sprite = $Head/Outfit_Outline

@onready var leftArmBase_sprite = $LeftArm/Base_Color
@onready var rightArmBase_sprite = $RightArm/Base_Color
@onready var torsoBase_sprite = $Torso/Base_Color
@onready var headBase_sprite = $Head/Base_Color

# Keys
var body_keys = []
var body_color_keys = []
var outfit_keys = []
var outfit_color_keys = []
var current_outfit_index = 0
var current_color_index = 0

func _ready():
	set_sprite_keys()
	update_sprite()

func set_sprite_keys():
	outfit_keys =  Global.torsoC_collection.keys()

# Update textures and modulate
func update_sprite():
	var current_sprite = outfit_keys[current_outfit_index]
	# Change textures of outlines
	leftArmO_sprite.texture = Global.leftArmO_collection[current_sprite]
	rightArmO_sprite.texture = Global.rightArmO_collection[current_sprite]
	torsoO_sprite.texture = Global.torsoO_collection[current_sprite]
	# Change textures of colors
	leftArmC_sprite.texture = Global.leftArmC_collection[current_sprite]
	rightArmC_sprite.texture = Global.rightArmC_collection[current_sprite]
	torsoC_sprite.texture = Global.torsoC_collection[current_sprite]
	# Change colors
	leftArmC_sprite.modulate = Global.colors[current_color_index]
	rightArmC_sprite.modulate = Global.colors[current_color_index]
	torsoC_sprite.modulate = Global.colors[current_color_index]
	#headC_sprite.modulate = Global.colors[current_color_index]
	
	Global.selected_outfit_color = Global.colors[current_color_index]
	Global.selected_outfit = current_sprite
	
	#Global.selected_body_color = Global.body_color_options[current_color_index]


func _on_color_button_pressed() -> void:
	current_outfit_index = (current_outfit_index + 1) % outfit_keys.size()
	update_sprite()

func _on_collection_button_pressed() -> void:
	current_color_index = (current_color_index + 1) % Global.colors.size()
