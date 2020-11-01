import { enhancementSlots, powerLevels } from "data/levels.js";

class Node {
  constructor(level) {
    this.level = level;
    this.quantity = 1;

    // this.prev;
    // this.next;
  }

  increment() {
    return ++this.quantity;
  }

  decrement() {
    return --this.quantity;
  }
}

class SlotsManager {
  constructor() {
    // this.head;
    // this.tail;
    // this.powerLevels;
    this.slotCount = 0;

    this.reset();
  }

  get length() {
    return this.slotCount;
  }

  _addNode(level) {
    this.slotCount++;
    if (this.tail && this.tail.level === level) {
      return this.tail.increment();
    }

    const node = new Node(level);
    if (this.powerLevels[level - 1] === true) {
      // If previous level was a power, add a pointer to this node
      this.powerLevels[level - 1] = node;
      node.powerLevel = level - 1;
    }
    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      node.prev = this.tail;
      this.tail.next = node;
      this.tail = node;
    }
  }

  _getNextNodeForPowerLevel(powerLevel) {
    const node = this.powerLevels[powerLevel];
    return node;
  }

  _removeNode(node) {
    const replacement = node.next;
    const previous = node.prev;
    const pl = node.powerLevel;

    // Slice node out of chain
    previous && (previous.next = replacement);
    replacement && (replacement.prev = previous);
    replacement && pl && (replacement.powerLevel = pl);
    pl && (this.powerLevels[pl] = replacement);

    // Replace end pointers
    !replacement && (this.tail = previous);
    !node.prev && (this.head = replacement);
  }

  previewSlot(powerLevel) {
    const node = this._getNextNodeForPowerLevel(powerLevel);
    return node ? node.level : null;
  }

  getSlot(powerLevel) {
    this.slotCount--;
    const node = this._getNextNodeForPowerLevel(powerLevel);

    if (!node) {
      return null;
    }

    node.decrement();
    if (node.quantity <= 0) {
      this._removeNode(node);
    }

    return node.level;
  }

  reset() {
    this.head = null;
    this.tail = null;
    this.powerLevels = { ...powerLevels };
    enhancementSlots.forEach((level) => this._addNode(level));
  }

  printChain() {
    let node = this.head;
    while (node) {
      console.log("LEVEL: ", node.level, "COUNT: ", node.quantity);
      node = node.next;
    }
  }
}

export default new SlotsManager();
