type Comparer<T> = (a: T, b: T) => boolean

export class Heap<T> {
  private innerArray: T[] = []
  private lessThan: Comparer<T>
  private equal: Comparer<T>

  public get length() {
    return this.innerArray.length
  }

  public constructor(lessThanFunction: Comparer<T>, equalityFunction: Comparer<T>) {
    this.lessThan = lessThanFunction,
    this.equal = equalityFunction
  }

  public add(value: T) {
    const newIndex = this.innerArray.push(value) - 1

    if (newIndex === 0) {
      return
    }

    let current = newIndex

    while (current > 0 && this.lessThan(this.innerArray[current], this.innerArray[this.parent(current)])) {
      [this.innerArray[current], this.innerArray[this.parent(current)]] = [this.innerArray[this.parent(current)], this.innerArray[current]]
      current = this.parent(current)
    }
  }

  public get(): T {
    if (this.innerArray.length === 0) {
      throw new Error("The heap is empty!")
    }

    const top = this.innerArray[0]

    if (this.innerArray.length === 1) {
      this.innerArray.pop()
      return top
    }

    this.innerArray[0] = this.innerArray.pop()!

    let current = 0

    while (true) {
      let newPosition = current
      let newValue = this.innerArray[current]

      if (
        this.innerArray[this.leftChild(current)] &&
        this.lessThan(this.innerArray[this.leftChild(current)], newValue)
      ) {
        newPosition = this.leftChild(current)
        newValue = this.innerArray[newPosition]
      }

      if (
        this.innerArray[this.rightChild(current)] &&
        this.lessThan(this.innerArray[this.rightChild(current)], newValue)
      ) {
        newPosition = this.rightChild(current)
        newValue = this.innerArray[newPosition]
      }

      if (newValue === this.innerArray[current]) {
        break
      } else {
        [this.innerArray[current], this.innerArray[newPosition]] = [this.innerArray[newPosition], this.innerArray[current]]
        current = newPosition
      }
    }

    return top
  }

  public has(valueToFind: T): boolean {
    return this.innerArray.findIndex(value => this.equal(value, valueToFind)) !== -1
  }

  private parent(index: number): number {
    if (index === 0) {
      throw new Error("The top of the heap has no parent!")
    }
    return Math.floor((index - 1) / 2)
  }

  private leftChild(index: number): number {
    return index * 2 + 1
  }

  private rightChild(index: number): number {
    return index * 2 + 2
  }
}
