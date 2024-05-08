package com.project.shopapp.repositories;

import com.project.shopapp.models.Order;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    //Tìm các đơn hàng của 1 user nào đó
    List<Order> findByUserId(Long userId);
    @Query("SELECT o FROM Order o WHERE o.active = true AND (:keyword IS NULL OR :keyword = '' OR " +
            "o.fullName LIKE %:keyword% " +
            "OR o.address LIKE %:keyword% " +
            "OR o.note LIKE %:keyword% " +
            "OR o.email LIKE %:keyword%)")
    Page<Order> findByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT COUNT(o) " +
            "FROM Order o " +
            "WHERE MONTH(o.orderDate) = :month " +
            "AND YEAR(o.orderDate) = :year " +
            "AND o.status = 'pending'")
    Long getTotalOrdersByMonth(@Param("month") int month, @Param("year") int year);

    @Query("SELECT MONTH(o.orderDate), YEAR(o.orderDate), SUM(o.totalMoney) " +
            "FROM Order o " +
            "WHERE MONTH(o.orderDate) = :month " +
            "AND YEAR(o.orderDate) = :year " +
            "AND o.status = 'pending' " +
            "GROUP BY MONTH(o.orderDate), YEAR(o.orderDate)")
    List<Object[]> getRevenueByMonth(@Param("month") int month, @Param("year") int year);

    @Query("SELECT MONTH(DATE(o.orderDate)) AS month, SUM(o.totalMoney) AS totalMoney " +
            "FROM Order o " +
            "WHERE YEAR(o.orderDate) = :year " +
            "AND o.status = 'pending' " +
            "GROUP BY MONTH(DATE(o.orderDate))")
    List<Object[]> getTotalMoneyByMonth(@Param("year") int year);
}
