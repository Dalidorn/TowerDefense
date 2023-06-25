export default class Tile {
    constructor(position, size) {
      this.position = position;
      this.size = size;
      this.isLocked = true;
      this.tower = null;
    }
  
    unlock() {
      this.isLocked = false;
    }
  
    placeTower(tower) {
      if (!this.isLocked && this.tower === null) {
        this.tower = tower;
        // Additional logic for placing a tower, such as updating UI or game state
      }
    }
  
    removeTower() {
      if (this.tower !== null) {
        this.tower = null;
        // Additional logic for removing a tower, such as updating UI or game state
      }
    }
  
    interact() {
      if (!this.isLocked) {
        // Logic for handling the player interaction with the tile
        // For example, opening a tower placement menu
      }
    }
  }
  