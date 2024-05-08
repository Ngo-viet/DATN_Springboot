package com.project.shopapp.services;

import com.project.shopapp.dtos.ArticleDTO;
import com.project.shopapp.models.Article;

import java.util.List;

public interface IArticleService {
    Article createArticle(ArticleDTO articleDTO);

    Article getArticleById(Long id);

    List<Article> getAllArticle();

    Article updateArticle(Long articleId, ArticleDTO articleDTO) throws Exception;

    void deleteArticle(Long id);
}
