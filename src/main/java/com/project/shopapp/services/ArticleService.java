package com.project.shopapp.services;

import com.project.shopapp.dtos.ArticleDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.models.Article;
import com.project.shopapp.repositories.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@RequiredArgsConstructor
public class ArticleService implements IArticleService{

    private final ArticleRepository articleRepository;

    @Override
    @Transactional
    public Article createArticle(ArticleDTO articleDTO) {
        Article newArticle = Article
                .builder()
                .title(articleDTO.getTitle())
                .description(articleDTO.getDescription())
                .thumbnail(articleDTO.getThumbnail())
                .build();
        return articleRepository.save(newArticle);
    }

    @Override
    public Article getArticleById(Long id) {
        return articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Can not found id: "+ id));
    }

    @Override
    public List<Article> getAllArticle() {
        return articleRepository.findAll();
    }

    @Override
    public Article updateArticle(Long articleId, ArticleDTO articleDTO)throws DataNotFoundException {
        Article existingArticle = getArticleById(articleId);
        existingArticle.setTitle(articleDTO.getTitle());
        existingArticle.setDescription(articleDTO.getDescription());
        existingArticle.setThumbnail(articleDTO.getThumbnail());
        articleRepository.save(existingArticle);
        return existingArticle;
    }

    @Override
    public void deleteArticle(Long id) {
        articleRepository.deleteById(id);
    }
}
