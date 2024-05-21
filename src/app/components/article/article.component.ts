import {Component, OnInit} from '@angular/core';
import {environment} from "../../environments/environment";
import {ActivatedRoute, Router} from "@angular/router";
import { Article } from '../../models/article';
import { ArticleService } from '../../services/article.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent implements OnInit {
  article?: Article;
  articleId: number = 0;
  articles: Article[] = [];
  currentImageIndex: number = 0;
  quantity: number = 1;
  isPressedAddToCart:boolean = false;
  categories: Category[] = []; 
  constructor(
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute,

    private router: Router,
  ){}
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const idParam = params['id'];
      if (idParam !== null) {
        this.articleId = +idParam;
        this.getArticleDetail(this.articleId);
      } else {
        console.log('Invalid article ID:', idParam);
      }
    });
    this.getArticles(1,4);
    this.getCategories(0,6);
  }

  getArticleDetail(id: number): void {
    this.articleService.getDetailArticle(id).subscribe({
      next: (response: any) => {
        if (response) {
          this.article = response; 
          // response.articles.forEach((article: Article) => {
          //   article.url = `${environment.apiBaseUrl}/products/images/${article.thumbnail}`;
          // });
          if (this.article) {
            this.article.url = `${environment.apiBaseUrl}/products/images/${this.article.thumbnail}`;
          } else {
            console.error('Article is undefined.');
          }
        } else {
          console.error('No article found in the response');
        }
      },
      error: (error: any) => {
        console.error('Error fetching article detail:', error);
      }
    });
  }

  getArticles(page: number, limit: number) {
    this.articleService.getArticles(page, limit).subscribe({
      next: (response: any) => {
        response.articles.forEach((article: Article) => {
          article.url = `${environment.apiBaseUrl}/products/images/${article.thumbnail}`;
        });
        this.articles = response.articles;

      },
      complete: () => {
        console.log('Fetching articles completed.');
      },
      error: (error) => {
        console.error('Error fetching articles:', error);
      }
    });
  }

  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (categories: Category[]) => {
        debugger
        this.categories = categories;
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  thumbnailClick(index: number){
    debugger
    //Goi khi mot thmbnail duoc bam
    this.currentImageIndex = index;
  }

  navigateToArticleDetail(articleId: number): void {
    this.router.navigate(['/articles', articleId]);
  }

 

}
