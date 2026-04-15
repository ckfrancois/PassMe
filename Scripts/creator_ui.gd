extends ColorRect
@onready var face_container = $"Face Container"
@onready var hair_container = $"Hair Container"
@onready var outfit_container = $"Outfit Container"
@onready var acc_container = $"Acc Container"

func _ready() -> void:
	face_container.visible = visible
	hair_container.visible = !visible
	outfit_container.visible = !visible
	acc_container.visible = !visible
	

func _on_face_pressed() -> void:
	face_container.visible = visible
	hair_container.visible = !visible
	outfit_container.visible = !visible
	acc_container.visible = !visible


func _on_hair_pressed() -> void:
	face_container.visible = !visible
	hair_container.visible = visible
	outfit_container.visible = !visible
	acc_container.visible = !visible


func _on_outfits_pressed() -> void:
	face_container.visible = !visible
	hair_container.visible = !visible
	outfit_container.visible = visible
	acc_container.visible = !visible


func _on_accessories_pressed() -> void:
	face_container.visible = !visible
	hair_container.visible = !visible
	outfit_container.visible = !visible
	acc_container.visible = visible
