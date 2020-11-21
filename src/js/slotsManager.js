import { enhancementSlots } from "data/levels.js";

class SlotsManager {
  constructor() {
    this.reset();
  }

  get length() {
    return this.slots.length;
  }

  _binarySearch(target) {
    let cursor;
    let bottom = 0;
    let top = this.slots.length - 1;

    if (!target || target > this.slots[top]) {
      return;
    }

    if (target < this.slots[bottom]) {
      return bottom;
    }

    while (top - bottom > 1) {
      cursor = Math.floor((bottom + top) / 2);
      const item = this.slots[cursor];

      if (item === target) {
        return cursor;
      }

      if (item < target) {
        bottom = cursor;
      }

      if (item > target) {
        top = cursor;
      }
    }

    return this.slots[top] === target ? top : bottom;
  }

  _findNextLargest(target, returnIndex) {
    let index = this._binarySearch(target);
    while (this.slots[index] && this.slots[index] < target) {
      index++;
    }
    return returnIndex ? index : this.slots[index];
  }

  _removeOnce(num) {
    const index = this._binarySearch(num);
    if (this.slots[index] === num) {
      this.slots.splice(index, 1);
    } else {
      console.log("COULD NOT REMOVE", num, "FROM ", this.slots);
    }
  }

  getSlot(powerLevel) {
    const slotLevel = this._findNextLargest(powerLevel);
    this._removeOnce(slotLevel);
    return slotLevel;
  }

  previewSlots(powerLevel, count = 1) {
    const firstIndex = this._findNextLargest(powerLevel, true);

    const slots = [];
    for (let i = 0; i < count; i++) {
      const index = firstIndex + i;
      const level = this.slots[index];
      if (level) {
        slots.push(level);
      } else {
        return false;
      }
    }

    return count === 1 ? slots[0] : slots;
  }

  returnSlots(slots) {
    slots.forEach(this.returnSlot);
  }

  returnSlot(slotLevel) {
    if (!slotLevel) {
      return;
    }

    let index = this._binarySearch(slotLevel);

    if (this.slots[index] >= slotLevel) {
      return this.slots.splice(index, 0, slotLevel);
    }

    while (this.slots[index] && this.slots[index] < slotLevel) {
      index++;
    }

    if (!this.slots[index]) {
      this.slots.push(slotLevel);
    } else {
      this.slots.splice(index, 0, slotLevel);
    }
  }

  reset() {
    this.slots = [...enhancementSlots];
  }
}

export default new SlotsManager();
