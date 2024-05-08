package com.project.shopapp.services.Report;

import com.project.shopapp.models.Order;
import com.project.shopapp.repositories.OrderRepository;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final OrderRepository orderRepository;

    public void generateExcel(HttpServletResponse response) throws Exception{
        List<Order> orders = orderRepository.findAll();

        HSSFWorkbook workbook = new HSSFWorkbook();
        HSSFSheet sheet = workbook.createSheet("Thong tin hoa don");
        HSSFRow row = sheet.createRow(0);
        row.createCell(0).setCellValue("ID");
        row.createCell(1).setCellValue("Họ và tên");
        row.createCell(2).setCellValue("Số điện thoại");
        row.createCell(3).setCellValue("Địa chỉ");
        row.createCell(4).setCellValue("Email");
        row.createCell(5).setCellValue("Ghi chú");
        row.createCell(6).setCellValue("Ngày tạo");
        row.createCell(7).setCellValue("Trạng thái");
        row.createCell(8).setCellValue("Tổng tiền");
        row.createCell(9).setCellValue("Phương thức vận chuyển");
        row.createCell(10).setCellValue("Phương thức thanh toán");

        int dataRowIndex = 1;
        for (Order order: orders){
            HSSFRow dataRow = sheet.createRow(dataRowIndex);
            dataRow.createCell(0).setCellValue(order.getId());
            dataRow.createCell(1).setCellValue(order.getFullName());
            dataRow.createCell(2).setCellValue(order.getPhoneNumber());
            dataRow.createCell(3).setCellValue(order.getAddress());
            dataRow.createCell(4).setCellValue(order.getEmail());
            dataRow.createCell(5).setCellValue(order.getNote());
            dataRow.createCell(6).setCellValue(order.getOrderDate());
            dataRow.createCell(7).setCellValue(order.getStatus());
            dataRow.createCell(8).setCellValue(order.getTotalMoney());
            dataRow.createCell(9).setCellValue(order.getShippingMethod());
            dataRow.createCell(10).setCellValue(order.getPaymentMethod());
            dataRowIndex ++;
        }
        ServletOutputStream outputStream = response.getOutputStream();
        workbook.write(outputStream);
        workbook.close();
        outputStream.close();

    }
}
