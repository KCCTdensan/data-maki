export class Barrier {
  #barrier: Int32Array;

  constructor(
    size: number,
    private readonly sab = new SharedArrayBuffer(4),
  ) {
    this.#barrier = new Int32Array(this.sab);

    this.add(size);
  }

  static connect(barrier: Barrier) {
    return new Barrier(0, barrier.sab);
  }

  private add(n: number) {
    const current = n + Atomics.add(this.#barrier, 0, n);

    if (current < 0) throw new Error("Barrier is poisoned: negative count");
    if (current > 0) return;

    Atomics.notify(this.#barrier, 0);
  }

  wait() {
    this.add(-1);

    while (true) {
      const count = Atomics.load(this.#barrier, 0);

      if (count === 0 || Atomics.wait(this.#barrier, 0, count) === "ok") return;
    }
  }
}
