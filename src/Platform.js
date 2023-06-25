export default class Platform {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }
  
    // Check if a given point is inside the platform
    isPointInside(x, y) {
      return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
    }
  
    // Check if a rectangle collides with the platform
    doesRectCollide(rect) {
      const rectLeft = rect.x;
      const rectRight = rect.x + rect.width;
      const rectTop = rect.y;
      const rectBottom = rect.y + rect.height;
  
      const platformLeft = this.x;
      const platformRight = this.x + this.width;
      const platformTop = this.y;
      const platformBottom = this.y + this.height;
  
      return (
        rectLeft < platformRight &&
        rectRight > platformLeft &&
        rectTop < platformBottom &&
        rectBottom > platformTop
      );
    }
  }
  