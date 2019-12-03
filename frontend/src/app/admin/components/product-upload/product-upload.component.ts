import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../service/product.service';

@Component({
  selector: 'app-product-upload',
  templateUrl: './product-upload.component.html',
  styleUrls: ['./product-upload.component.scss']
})
export class ProductUploadComponent implements OnInit {

  isLoading = false;
  message = '';

  constructor(private productService: ProductService) {
  }

  ngOnInit() {
  }

  handleFileInput(files: FileList) {
    this.isLoading = true;
    this.message = '';
    this.productService.uploadCsv(files.item(0)).subscribe(v => {
      this.isLoading = false;
      this.message = 'Done!';
    }, error => {
      this.isLoading = false;
      this.message = 'Failed! Check the logs.';
      console.error(error);
    });
  }
}
