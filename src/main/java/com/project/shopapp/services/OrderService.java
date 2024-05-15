package com.project.shopapp.services;

import com.project.shopapp.dtos.CartItemDTO;
import com.project.shopapp.dtos.OrderDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.models.*;
import com.project.shopapp.repositories.OrderDetailRepository;
import com.project.shopapp.repositories.OrderRepository;
import com.project.shopapp.repositories.ProductRepository;
import com.project.shopapp.repositories.UserRepository;
import com.project.shopapp.responses.Order.ChartTotalResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.aspectj.weaver.ast.Or;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService{
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final OrderDetailRepository orderDetailRepository;

    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public Order createOrder(OrderDTO orderDTO) throws Exception {
        // Kiểm tra xem cartItems có null không
        if (orderDTO.getCartItems() == null) {
            throw new Exception("Cart items cannot be null.");
        }

        // Tìm xem user'id có tồn tại không
        User user = userRepository
                .findById(orderDTO.getUserId())
                .orElseThrow(() -> new DataNotFoundException("Cannot find user with id: " + orderDTO.getUserId()));

        // Convert orderDTO => Order
        modelMapper.typeMap(OrderDTO.class, Order.class)
                .addMappings(mapper -> mapper.skip(Order::setId));

        // Cập nhật các trường của đơn hàng từ orderDTO
        Order order = new Order();
        modelMapper.map(orderDTO, order);
        order.setUser(user);
        order.setOrderDate(new Date());// Lấy thời điểm hiện tại
        order.setStatus(OrderStatus.NOT_COMPLETED);

        // Kiểm tra shipping date phải >= ngày hôm nay
        LocalDate shippingDate = orderDTO.getShippingDate() == null
                ? LocalDate.now() : orderDTO.getShippingDate();
        if ("express".equals(orderDTO.getShippingMethod())) {
            shippingDate = shippingDate.plusDays(3);
        } else if ("normal".equals(orderDTO.getShippingMethod())) {
            shippingDate = shippingDate.plusDays(6);
        }

        if (shippingDate.isBefore(LocalDate.now())) {
            throw new DataNotFoundException("Date must be at least today !");
        }
        order.setShippingDate(shippingDate);
        order.setActive(true); // Đoạn này nên set sẵn trong SQL
        order.setTotalMoney(orderDTO.getTotalMoney());
        orderRepository.save(order);

        // Tạo danh sách các đối tượng OrderDetail từ cartItems
        List<OrderDetail> orderDetails = orderDTO.getCartItems().stream().map(cartItemDTO -> {
            try {
                // Tìm sản phẩm từ cartItemDTO
                Product product = productRepository.findById(cartItemDTO.getProductId())
                        .orElseThrow(() -> new Exception("Product not found with id: " + cartItemDTO.getProductId()));

                // Tạo OrderDetail từ CartItemDTO
                OrderDetail orderDetail = new OrderDetail();
                orderDetail.setOrder(order);
                orderDetail.setProduct(product);
                orderDetail.setNumberOfProducts(cartItemDTO.getQuantity());
                orderDetail.setPrice(product.getPrice());

                // Tính toán total_money cho mỗi OrderDetail
                Float totalMoney = product.getPrice() * cartItemDTO.getQuantity();
                orderDetail.setTotalMoney(totalMoney);

                return orderDetail;
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }).collect(Collectors.toList());

        // Lưu danh sách OrderDetail vào cơ sở dữ liệu
        orderDetailRepository.saveAll(orderDetails);

        return order;
    }


    @Override
    public Order getOrder(Long id) {
        Order selectedOrder = orderRepository.findById(id).orElse(null);
        return selectedOrder;
    }

    @Override
    @Transactional
    public Order updateOrder(Long id, OrderDTO orderDTO)
            throws DataNotFoundException {
        Order order = orderRepository.findById(id).orElseThrow(() ->
                new DataNotFoundException("Cannot find order with id: " + id));
        User existingUser = userRepository.findById(
                orderDTO.getUserId()).orElseThrow(() ->
                new DataNotFoundException("Cannot find user with id: " + id));
        // Tạo một luồng bảng ánh xạ riêng để kiểm soát việc ánh xạ
        modelMapper.typeMap(OrderDTO.class, Order.class)
                .addMappings(mapper -> mapper.skip(Order::setId));
        // Cập nhật các trường của đơn hàng từ orderDTO
        modelMapper.map(orderDTO, order);
        order.setUser(existingUser);
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id).orElse(null);
        //no hard-delete, => please soft-delete
        if(order != null) {
            order.setActive(false);
            orderRepository.save(order);
        }
    }

    @Override
    public List<Order> findByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public Page<Order> getOrdersByKeyword(String keyword, Pageable pageable) {
        return orderRepository.findByKeyword(keyword, pageable);
    }

    @PersistenceContext
    private EntityManager entityManager;

    public List<ChartTotalResponse> getTotalMoneyByMonth(int year) {
        List<Object[]> resultList = entityManager.createQuery(
                        "SELECT MONTH(o.orderDate) AS month, SUM(o.totalMoney) AS totalMoney " +
                                "FROM Order o " +
                                "WHERE YEAR(o.orderDate) = :year " +
                                "AND o.status = 'completed' " +
                                "GROUP BY MONTH(o.orderDate)")
                .setParameter("year", year)
                .getResultList();

        List<ChartTotalResponse> chartTotalResponses = resultList.stream()
                .map(result -> new ChartTotalResponse((int) result[0], (double) result[1]))
                .collect(Collectors.toList());

        return chartTotalResponses;
    }

    @Transactional(readOnly = true)
    public Long getTotalOrdersByMonth(int month, int year) {
        return orderRepository.getTotalOrdersByMonth(month, year);
    }

    @Transactional(readOnly = true)
    public Double getTotalMoney(int month, int year) {
        return orderRepository.getTotalMoney(month, year);
    }
}
