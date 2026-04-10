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
@onready var legBase_sprite = $Legs/Base_Color

@onready var legC_sprite = $Legs/Outfit_Color
@onready var legO_sprite = $Legs/Outfit_Outline

@onready var shoeC_sprite = $Shoes/Outfit_Color
@onready var shoeO_sprite = $Shoes/Outfit_Outline

# Keys
var outfit_keys = []
var leg_keys = []
var shoe_keys = []

var current_body_index = 0

var current_outfit_index = 0
var current_outfit_color_index = 0

var current_leg_index = 0
var current_leg_color_index = 0

var current_shoe_index = 0
var current_shoe_color_index = 0

func _ready():
	set_sprite_keys()
	updateOutfit_sprite()
	updateLeg_sprite()

func set_sprite_keys():
	outfit_keys =  Global.torsoO_collection.keys()
	leg_keys = Global.legO_collection.keys()
	shoe_keys = Global.shoeO_collection.keys()
	
# Modulate for outfits
func updateBody_sprite():
	leftArmBase_sprite.modulate = Global.body_colors[current_body_index]
	rightArmBase_sprite.modulate = Global.body_colors[current_body_index]
	torsoBase_sprite.modulate = Global.body_colors[current_body_index]
	headBase_sprite.modulate = Global.body_colors[current_body_index]
	legBase_sprite.modulate = Global.body_colors[current_body_index]

# Update textures and modulate for outfits
func updateOutfit_sprite():
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
	leftArmC_sprite.modulate = Global.colors[current_outfit_color_index]
	rightArmC_sprite.modulate = Global.colors[current_outfit_color_index]
	torsoC_sprite.modulate = Global.colors[current_outfit_color_index]
	#headC_sprite.modulate = Global.colors[current_color_index]
	
	Global.selected_outfit_color = Global.colors[current_outfit_color_index]
	Global.selected_outfit = current_sprite
	
	#Global.selected_body_color = Global.body_color_options[current_color_index]

# Update textures and modulate for legs
func updateLeg_sprite():
	var current_sprite = leg_keys[current_leg_index]
	# Change textures of outlines
	legO_sprite.texture = Global.legO_collection[current_sprite]
	# Change textures of colors
	legC_sprite.texture = Global.legC_collection[current_sprite]
	# Change colors
	legC_sprite.modulate = Global.colors[current_leg_color_index]
	
	Global.selected_legs_color = Global.colors[current_leg_color_index]
	Global.selected_legs = current_sprite

# Update textures and modulate for shoes
func updateShoe_sprite():
	var current_sprite = shoe_keys[current_shoe_index]
	# Change textures of outlines
	shoeO_sprite.texture = Global.shoeO_collection[current_sprite]
	# Change textures of colors
	shoeC_sprite.texture = Global.shoeC_collection[current_sprite]
	# Change colors
	shoeC_sprite.modulate = Global.colors[current_shoe_color_index]
	
	Global.selected_shoe_color = Global.colors[current_shoe_color_index]
	Global.selected_shoe = current_sprite


func _on_color_button_pressed() -> void:
	current_outfit_color_index = (current_outfit_color_index + 1) % Global.colors.size()
	updateOutfit_sprite()

func _on_collection_button_pressed() -> void:
	current_outfit_index = (current_outfit_index + 1) % outfit_keys.size()
	updateOutfit_sprite()


func _on_legs_button_pressed() -> void:
	current_leg_index = (current_leg_index + 1) % leg_keys.size()
	updateLeg_sprite()


func _on_legs_color_button_pressed() -> void:
	current_leg_color_index = (current_leg_color_index + 1) % Global.colors.size()
	updateLeg_sprite()


func _on_body_color_button_pressed() -> void:
	current_body_index = (current_body_index + 1) % Global.body_colors.size()
	updateBody_sprite()


func _on_shoe_button_pressed() -> void:
	current_shoe_index = (current_shoe_index + 1) % shoe_keys.size()
	updateShoe_sprite()


func _on_shoe_color_button_pressed() -> void:
	current_shoe_color_index = (current_shoe_color_index + 1) % Global.colors.size()
	updateShoe_sprite()
