import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Flex,
  Form,
  FormProps,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Typography,
} from "antd";
import { toast } from "react-toastify";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { FIELD_TYPE } from "../../constants/field";
import { convertObjectToArray } from "../../utils/object";
import axios from "axios";
import { createField } from "../../apis/field";

export interface IEquipment {
  name: string;
  price: number;
}

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

export interface IFieldForm {
  name: string;
  specificAddress: string;
  ward: string;
  district: string;
  province: string;
  phone: string;
  type: FIELD_TYPE;
  capacity: number;
  price: number;
  equipments: IEquipment[];
}

interface ICreateFieldFormProps {
  open: boolean;
  onClose: () => void;
  reload: () => void;
}

const PROVINCE_API = "https://provinces.open-api.vn/api/p/";
const DISTRICT_API = "https://provinces.open-api.vn/api/p/";
const WARD_API = "https://provinces.open-api.vn/api/d/";

function CreateFieldForm(props: ICreateFieldFormProps) {
  const { open, onClose, reload } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [form] = Form.useForm<IFieldForm>();

  const loadProvinces = async () => {
    try {
      const response = await axios.get(PROVINCE_API);
      setProvinces(response.data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const loadDistricts = async (provinceCode: string) => {
    try {
      const response = await axios.get(
        `${DISTRICT_API}${provinceCode}?depth=2`
      );
      setDistricts(response.data.districts);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const loadWards = async (districtCode: string) => {
    try {
      const response = await axios.get(`${WARD_API}${districtCode}?depth=2`);
      setWards(response.data.wards);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  useEffect(() => {
    loadProvinces();
  }, []);

  const handleProvinceChange = (value: string, option: any) => {
    console.log(option);
    form.setFieldValue("district", undefined);
    form.setFieldValue("ward", undefined);
    setWards([]);
    loadDistricts(option.key);
  };

  const handleDistrictChange = (value: string, option: any) => {
    form.setFieldValue("ward", undefined);
    loadWards(option.key);
  };

  const onFinish: FormProps<IFieldForm>["onFinish"] = async (values) => {
    setIsLoading(true);

    await createField({
      body: { ...values },
      successHandler: {
        callBack(data) {
          toast.success("Thêm sân thành công!");
          setIsLoading(false);
          onClose();
        },
      },
      errorHandler: {
        callBack(error) {
          toast.error("Thêm sân thất bại!");
          setIsLoading(false);
        },
      },
    });
    reload();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      title="Thêm sân"
      open={open}
      footer={null}
      destroyOnClose
      closable={false}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item<IFieldForm>
              label="Tên"
              style={{ marginBottom: 8 }}
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên" }]}
            >
              <Input className="app-input" placeholder="Nhập tên" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<IFieldForm>
              label="Số điện thoại"
              name="phone"
              style={{ marginBottom: 8 }}
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
              ]}
            >
              <Input className="app-input" placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<IFieldForm>
              label="Địa chỉ"
              name="specificAddress"
              style={{ marginBottom: 8 }}
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
            >
              <Input className="app-input" placeholder="Nhập địa chỉ" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item<IFieldForm>
              label="Tinh/Thành Phố"
              name="province"
              style={{ marginBottom: 8 }}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tỉnh hoặc thành phố",
                },
              ]}
            >
              <Select
                onChange={handleProvinceChange}
                className="app-input"
                placeholder="Chọn tỉnh hoặc thành phố"
              >
                {provinces.map((province) => (
                  <Select.Option key={province.code} value={province.name}>
                    {province.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item<IFieldForm>
              label="Quận/Huyện"
              name="district"
              style={{ marginBottom: 8 }}
              rules={[
                { required: true, message: "Vui lòng nhập quận hoặc huyện" },
              ]}
            >
              <Select
                onChange={handleDistrictChange}
                placeholder="Chọn nhập quận hoặc huyện"
              >
                {districts.map((district) => (
                  <Select.Option key={district.code} value={district.name}>
                    {district.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item<IFieldForm>
              label="Xã/Phường"
              name="ward"
              style={{ marginBottom: 8 }}
              rules={[
                { required: true, message: "Vui lòng nhập xã hoặc phường" },
              ]}
            >
              <Select className="app-input" placeholder="Chọn xã hoặc phường">
                {wards.map((ward) => (
                  <Select.Option key={ward.code} value={ward.name}>
                    {ward.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item<IFieldForm>
              label="Số lượng"
              name="capacity"
              style={{ marginBottom: 8 }}
              rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                className="app-input"
                placeholder="Nhập số lượng"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item<IFieldForm>
              label="Giá"
              name="price"
              style={{ marginBottom: 8 }}
              rules={[{ required: true, message: "Vui lòng nhập giá" }]}
            >
              <InputNumber
                className="app-input"
                style={{ width: "100%" }}
                placeholder="Nhập giá"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item<IFieldForm>
              label="Môn thể thao"
              name="type"
              style={{ marginBottom: 8 }}
              rules={[
                { required: true, message: "Vui lòng nhập môn thể thao" },
              ]}
            >
              <Select
                className="app-input"
                placeholder="Nhập thể thao"
                options={convertObjectToArray(FIELD_TYPE)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Typography style={{ fontWeight: 600, marginTop: 16, marginBottom: 8 }}>
          Thiết bị
        </Typography>
        <Row>
          <Col span={24}>
            <Form.List name="equipments">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row key={key} gutter={16}>
                      <Col span={11}>
                        <Form.Item
                          {...restField}
                          label="Tên thiết bị"
                          name={[name, "name"]}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập tên thiết bị",
                            },
                          ]}
                        >
                          <Input
                            className="app-input"
                            placeholder="Nhập tên thiết bị"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={11}>
                        <Form.Item
                          {...restField}
                          name={[name, "price"]}
                          label="Giá"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập giá",
                            },
                          ]}
                        >
                          <InputNumber
                            className="app-input"
                            style={{ width: "100%" }}
                            placeholder="Nhập giá"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Col>
                    </Row>
                  ))}

                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                    >
                      Thêm thiết bị
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Col>
        </Row>
        <Col span={24}>
          <Flex justify="flex-end" style={{ marginTop: 16, gap: 16 }}>
            <Button type="primary" danger onClick={handleCancel}>
              Huỷ
            </Button>
            <Button htmlType="submit" type="primary" loading={isLoading}>
              Thêm
            </Button>
          </Flex>
        </Col>
      </Form>
    </Modal>
  );
}

export default CreateFieldForm;
