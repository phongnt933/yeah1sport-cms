import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Select, Button, Spin, Row, Col, message } from "antd";

// Định nghĩa kiểu cho tỉnh, huyện, xã/phường
type Province = {
  code: string;
  name: string;
};

type District = {
  code: string;
  name: string;
};

type Ward = {
  code: string;
  name: string;
};

const AddressForm: React.FC = () => {
  // State quản lý dữ liệu
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // API URLs
  const PROVINCE_API = "https://provinces.open-api.vn/api/p/";
  const DISTRICT_API = "https://provinces.open-api.vn/api/p/";
  const WARD_API = "https://provinces.open-api.vn/api/d/";

  // Tải danh sách tỉnh/thành phố
  const loadProvinces = async () => {
    try {
      setLoading(true);
      const response = await axios.get(PROVINCE_API);
      setProvinces(response.data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tải danh sách quận/huyện khi chọn tỉnh
  const loadDistricts = async (provinceCode: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${DISTRICT_API}${provinceCode}?depth=2`
      );
      setDistricts(response.data.districts);
      setWards([]); // Reset xã/phường khi thay đổi quận/huyện
    } catch (error) {
      console.error("Error fetching districts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tải danh sách xã/phường khi chọn quận/huyện
  const loadWards = async (districtCode: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${WARD_API}${districtCode}?depth=2`);
      setWards(response.data.wards);
    } catch (error) {
      console.error("Error fetching wards:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi loadProvinces khi component mount
  useEffect(() => {
    loadProvinces();
  }, []);

  // Xử lý khi thay đổi tỉnh
  const handleProvinceChange = (value: string) => {
    loadDistricts(value);
  };

  // Xử lý khi thay đổi quận/huyện
  const handleDistrictChange = (value: string) => {
    loadWards(value);
  };

  // Xử lý khi submit form
  const handleSubmit = (values: any) => {
    console.log("Thông tin địa chỉ đã chọn: ", values);
    message.success("Thông tin địa chỉ đã được gửi!");
  };

  return (
    <div>
      <h1>Chọn Địa Chỉ</h1>

      <Spin spinning={loading}>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            {/* Chọn Tỉnh/Thành phố */}
            <Col span={8}>
              <Form.Item
                label="Tỉnh/Thành phố"
                name="province"
                rules={[
                  { required: true, message: "Vui lòng chọn tỉnh/thành phố!" },
                ]}
              >
                <Select
                  onChange={handleProvinceChange}
                  placeholder="Chọn Tỉnh/Thành phố"
                >
                  {provinces.map((province) => (
                    <Select.Option key={province.code} value={province.code}>
                      {province.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Chọn Quận/Huyện */}
            {districts.length > 0 && (
              <Col span={8}>
                <Form.Item
                  label="Quận/Huyện"
                  name="district"
                  rules={[
                    { required: true, message: "Vui lòng chọn quận/huyện!" },
                  ]}
                >
                  <Select
                    onChange={handleDistrictChange}
                    placeholder="Chọn Quận/Huyện"
                  >
                    {districts.map((district) => (
                      <Select.Option key={district.code} value={district.code}>
                        {district.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )}

            {/* Chọn Xã/Phường */}
            {wards.length > 0 && (
              <Col span={8}>
                <Form.Item
                  label="Xã/Phường"
                  name="ward"
                  rules={[
                    { required: true, message: "Vui lòng chọn xã/phường!" },
                  ]}
                >
                  <Select placeholder="Chọn Xã/Phường">
                    {wards.map((ward) => (
                      <Select.Option key={ward.code} value={ward.code}>
                        {ward.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )}
          </Row>

          {/* Nút Submit */}
          <Row>
            <Col span={24}>
              <Button type="primary" htmlType="submit">
                Xác nhận
              </Button>
            </Col>
          </Row>
        </Form>
      </Spin>
    </div>
  );
};

export default AddressForm;
