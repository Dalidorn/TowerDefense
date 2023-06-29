export class Tower {
    constructor(position, range) {
        this.position = position;
        this.range = range;
        this.damageDealt = 0;
        this.enemiesKilled = 0;
        // Common properties and methods for all towers
    }

    upgrade() {
        // Logic for upgrading the tower, e.g., increase attack power, attack speed, or range
    }

    sell() {
        // Logic for selling or destroying the tower, e.g., removing it from the game or giving the player currency
        // You can also calculate any refund amount based on the tower's properties
    }

    // Common methods for all towers
}

export class AttackingTower extends Tower {
    constructor(position, range, attackPower, attackSpeed) {
        super(position, range);
        this.attackPower = attackPower;
        this.attackSpeed = attackSpeed;
        this.target = null;
        this.isAttacking = false;
        // Additional properties for attacking towers
    }

    // Additional methods for attacking towers
    setTargetingPriority(priority) {
        // Logic for setting the targeting priority of the tower, e.g., highest health, closest distance, etc.
    }

    findTarget(enemies) {
        // Logic for finding a target from the provided enemies based on range and priority
        // Assign the target to the "target" property
    }

    attack() {
        if (this.target) {
            // Logic for attacking the target, such as reducing its health
            this.damageDealt += this.attackPower;
            // Check if the target is dead
            if (this.target.health <= 0) {
                this.target = null;
                this.enemiesKilled++;
            }
        }
    }

    startAttacking() {
        if (!this.isAttacking) {
            this.isAttacking = true;
            // Additional logic for starting the attack loop, such as using setInterval
        }
    }

    stopAttacking() {
        if (this.isAttacking) {
            this.isAttacking = false;
            // Additional logic for stopping the attack loop, such as using clearInterval
        }
    }
}

export class SupportTower extends Tower {
    constructor(position, range) {
        super(position, range);
        this.nearbyTowers = [];
        // Additional properties for support towers
    }

    // Additional methods for support towers
}

export class UtilityTower extends Tower {
    constructor(position) {
        super(position, 0); // Utility tower has no range
        // Additional properties for utility towers
    }

    // Additional methods for utility towers
}
