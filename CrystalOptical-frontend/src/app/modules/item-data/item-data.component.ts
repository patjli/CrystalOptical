import { Component, OnInit } from '@angular/core';
import {itemsInterface} from "../../models/items.interface";
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../../services/api.service";
import {StorageService} from "../../services/storage.service";
import {itemsQuantityInterface} from "../../models/itemQuantity.interface";

@Component({
  selector: 'item-data',
  templateUrl: './item-data.component.html',
  styleUrls: ['./item-data.component.css']


})

export class ItemDataComponent implements OnInit {
  description: string = "";

  item: itemsInterface;

  quantity_value: number = 1;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private storageService: StorageService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.initializeItem(+params["id"]);
    });
  }


  private initializeItem(id: number) {
    this.apiService.getItem(id).subscribe({next : (data: itemsInterface) => {
      this.item = data;
      this.description = "This " + data.brand + " " + data.name + " in " + data.colour + " colour and " + data.frameSize + " size";
      }});
  }

  decrementQuantity() {
    if (this.quantity_value >= 2) {
      this.quantity_value -= 1
    }
  }
  incrementQuantity() {
    if (this.quantity_value <= 4) {
      this.quantity_value += 1
    }
  }

  buy(){
    let cartItems = this.storageService.getCart();
    let inCart = false;
    let item = this.item;
    let quantity = this.quantity_value;
    cartItems.forEach(function(data) {
      if(data.item.id == item.id) {
        inCart = true;
        data.quantity = data.quantity + quantity;
      }
    });

    if(!inCart) {
      let add: itemsQuantityInterface = {
        item: item,
        quantity: quantity
      }
      cartItems.push(add);
    }
    this.storageService.updateCart(cartItems);
  }

}
