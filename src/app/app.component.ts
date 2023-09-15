import {ChangeDetectionStrategy, Component, computed, effect, signal} from "@angular/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'angularSignals';
  quantityList = signal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  quantity = signal<number>(0);
  totalQuantity = signal<number>(0);
  totalPrice = signal<number>(0);
  products = signal<Product[]>([
    {
      id: 1, name: 'Elephant', qty: 10, price: 1000000, description: 'Elephants are the largest living land animals. ' +
        'Three living species are currently recognised: the African bush elephant, ' +
        'the African forest elephant, and the Asian elephant. '
    },
    {
      id: 2, name: 'Giraffe', qty: 15, price: 600000, description: 'The giraffe is a large African hoofed mammal ' +
        'belonging to the genus Giraffe. ' +
        'It is the tallest living terrestrial animal and the largest ruminant on Earth.'
    },
    {
      id: 3, name: 'Monkey', qty: 95, price: 70000, description: 'Monkey is a common name that may refer to most mammals ' +
        'of the infraorder Simiiformes, also known as the simians.'
    },
    {
      id: 4, name: 'Lion', qty: 99, price: 900000, description: 'The lion is a large cat of the genus Panthera native to Africa' +
        ' and India. It has a muscular, broad-chested body; short, ' +
        'rounded head; round ears; and a hairy tuft at the end of its tail. '
    },
    {
      id: 5, name: 'Cheetah', qty: 112, price: 450000, description: 'The cheetah is a large cat native to Africa, central Iran,' +
        ' and has been reintroduced to India in 2022. '
    }
  ]);
  cart = signal<Cart[]>([]);
  color = computed(() => this.totalPrice() > 600000 ? 'green' : 'red');

  constructor() {
    // Used in Logging data being displayed and when it changes
    effect(() => console.log(JSON.stringify(this.totalPrice())));
  }

  quantitySelected(qty: number) {
    this.quantity.set(Number(qty));
  }

  addToCart(product: Product, index: number): void {
    if (this.quantity() === 0)
      this.quantity.set(1);
    this.totalQuantity.update((qty) => qty + this.quantity());
    this.totalPrice.update((price) => price + (this.quantity() * product.price));
    this.products.mutate(product => product[index].qty = (product[index].qty - this.quantity()));
    this.cart.mutate(value => value.push(
      {id: product.id, name: product.name, qty: this.quantity(), price: product.price}));
    this.quantity.set(0);
  }

  deleteCartItem(index: number) {
    this.cart.mutate(v => v.splice(index, 1))
  }
}

export interface Product {
  id: number;
  name: string;
  qty: number;
  price: number;
  description: string
}

export interface Cart {
  id: number;
  name: string;
  qty: number;
  price: number;
}
