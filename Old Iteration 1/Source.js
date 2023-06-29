export default class Source {
    constructor(position, initialHealth) {
      this.position = position;
      this.health = initialHealth;
      this.maxHealth = initialHealth;
      this.isDestroyed = false;
    }
  
    takeDamage(damage) {
      if (!this.isDestroyed) {
        this.health -= damage;
  
        if (this.health <= 0) {
          this.health = 0;
          this.isDestroyed = true;
          this.onDestroyed();
        }
      }
    }
  
    repair(amount) {
      if (!this.isDestroyed) {
        this.health += amount;
  
        if (this.health > this.maxHealth) {
          this.health = this.maxHealth;
        }
      }
    }
  
    upgrade() {
      // Logic for upgrading the source
      // You can define properties or behaviors to reflect the upgraded state
    }
  
    onDestroyed() {
      // Logic to trigger end game state
      // This method can be overridden in a subclass or customized as needed
      console.log('Game over - Source destroyed!');
    }
  }
  