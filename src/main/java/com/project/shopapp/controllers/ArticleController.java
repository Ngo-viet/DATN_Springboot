package com.project.shopapp.controllers;

import com.project.shopapp.components.LocalizationUtils;
import com.project.shopapp.dtos.ArticleDTO;
import com.project.shopapp.dtos.CategoryDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.models.Article;
import com.project.shopapp.models.Category;
import com.project.shopapp.responses.ArticleResponse;
import com.project.shopapp.responses.CategoryResponse;
import com.project.shopapp.responses.UpdateArticleResponse;
import com.project.shopapp.responses.UpdateCategoryResponse;
import com.project.shopapp.services.ArticleService;
import com.project.shopapp.utils.MessageKeys;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.LocaleResolver;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;
    private final LocaleResolver localeResolver;
    private final MessageSource messageSource;
    private final LocalizationUtils localizationUtils;

    @PostMapping("")

    public ResponseEntity<ArticleResponse> createArticle(
            @Valid @RequestBody ArticleDTO articleDTO,
            BindingResult result) {
        ArticleResponse articleResponse = new ArticleResponse();
        if(result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();
            articleResponse.setMessage(localizationUtils.getLocalizedMessage("Insert article failed"));
            articleResponse.setErrors(errorMessages);
            return ResponseEntity.badRequest().body(articleResponse);
        }
        Article article = articleService.createArticle(articleDTO);
        articleResponse.setArticle(article);
        return ResponseEntity.ok(articleResponse);
    }

    //Hiện tất cả các categories
    @GetMapping("")
    public ResponseEntity<List<Article>> getAllArticles(
            @RequestParam("page")     int page,
            @RequestParam("limit")    int limit
    ) {
        List<Article> articles = articleService.getAllArticle();
        return ResponseEntity.ok(articles);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UpdateArticleResponse> updateArticle(
            @PathVariable Long id,
            @Valid @RequestBody ArticleDTO articleDTO
    )throws DataNotFoundException {
        UpdateArticleResponse updateArticleResponse = new UpdateArticleResponse();
        articleService.updateArticle(id, articleDTO);
        updateArticleResponse.setMessage(localizationUtils.getLocalizedMessage("UPDATE_ARTICLE_SUCCESSFULLY"));
        return ResponseEntity.ok(updateArticleResponse);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteArticle(@PathVariable Long id) {
        articleService.deleteArticle(id);
        return ResponseEntity.ok(localizationUtils.getLocalizedMessage("DELETE_CATEGORY_SUCCESSFULLY"));
    }
}
