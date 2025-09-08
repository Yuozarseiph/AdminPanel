"use client";
import "./globals.css";
import AdminPanel from "../components/AdminPanel";
import React, { useState, useEffect } from "react";

// داده‌های نمونه که معمولاً از API دریافت می‌شوند
const sampleChartData = [
  { name: "Jan", sales: 1200, users: 300 }, { name: "Feb", sales: 1800, users: 380 },
  { name: "Mar", sales: 1500, users: 420 }, { name: "Apr", sales: 2200, users: 460 },
  { name: "May", sales: 2800, users: 520 }, { name: "Jun", sales: 2500, users: 590 },
  { name: "Jul", sales: 3200, users: 650 },
];

const sampleKpiData = {
  sales: { value: "$12,480", delta: "↑ 12%", sub: "vs last month" },
  orders: { value: "152", delta: "↑ 5%", sub: "in the last 30 days" },
  users: { value: "650", delta: "↑ 8%", sub: "currently online" },
  conversion: { value: "2.6%", delta: "↑ 0.4%", sub: "store average" },
};


export default function HomePage() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  // این useEffect شبیه‌سازی دریافت داده از یک API است
  useEffect(() => {
    // Fetch initial data from your API here
    const initialOrders = [
      { id: "ORD-1024", customer: "Elena M.", date: "2025-08-30", total: 129.9, status: "Paid" },
      { id: "ORD-1025", customer: "John D.", date: "2025-08-31", total: 59.0, status: "Pending" },
    ];
    const initialCustomers = [
      { id: "CUS-2001", name: "Elena M.", email: "elena@example.com", joined: "2025-07-21", status: "Active" },
      { id: "CUS-2002", name: "John D.", email: "john@example.com", joined: "2025-08-02", status: "Active" },
    ];
    setOrders(initialOrders);
    setCustomers(initialCustomers);
  }, []);

  // توابع برای مدیریت تغییرات داده‌ها
  const handleAddOrder = (newOrderData) => {
    // در یک برنامه واقعی، این تابع یک درخواست API برای افزودن سفارش ارسال می‌کند
    console.log("Adding new order:", newOrderData);
    const newOrder = {
      ...newOrderData,
      id: `ORD-${Math.floor(Math.random() * 9000 + 1000)}`,
      date: new Date().toISOString().slice(0, 10),
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const handleAddCustomer = (newCustomerData) => {
    console.log("Adding new customer:", newCustomerData);
    const newCustomer = {
      ...newCustomerData,
      id: `CUS-${Math.floor(Math.random()*9000+1000)}`,
      joined: new Date().toISOString().slice(0,10),
      status: "Active",
    };
    setCustomers(prev => [newCustomer, ...prev]);
  };

  const handleUpdateCustomer = (customerId, updatedData) => {
    console.log(`Updating customer ${customerId} with`, updatedData);
    setCustomers(prev =>
      prev.map(c => (c.id === customerId ? { ...c, ...updatedData } : c))
    );
  };


  return (
    <AdminPanel
      title="My E-Commerce"
      // پاس دادن داده‌ها
      orders={orders}
      customers={customers}
      chartData={sampleChartData}
      kpiData={sampleKpiData}
      // پاس دادن توابع مدیریت رویداد
      onAddOrder={handleAddOrder}
      onAddCustomer={handleAddCustomer}
      onUpdateCustomer={handleUpdateCustomer}
    />
  );
}