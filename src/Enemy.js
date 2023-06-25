export default class Enemy {
    constructor(position, size, speed, attack, attackSpeed, attackRange) {
      this.position = position;
      this.size = size;
      this.speed = speed;
      this.attackValue = attack;
      this.attackSpeed = attackSpeed;
      this.attackRange = attackRange;
      this.health = 100;
      this.isDead = false;
      this.target = null;
    }
  
    moveTowards(target) {
      // Logic to move the enemy towards the target
      // This can be implemented using various movement algorithms
      // Update the position based on speed and target position
      // You can use the requestAnimationFrame or a game loop to animate the movement
    }
  
    attackTarget() {
      // Logic to attack the target
      // Reduce target's health based on attack value and attack speed
      // Use a timer or game loop to control the attack rate
    }
  
    takeDamage(damage) {
      if (!this.isDead) {
        this.health -= damage;
  
        if (this.health <= 0) {
          this.health = 0;
          this.isDead = true;
          this.onDeath();
        }
      }
    }
  
    onDeath() {
      // Logic to handle the enemy's death
      // This method can be overridden in a subclass or customized as needed
      console.log('Enemy defeated!');
    }
  }
  