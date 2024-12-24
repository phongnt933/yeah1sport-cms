import {
  Button,
  Form,
  FormProps,
  Input,
  InputNumber,
  Modal,
  Select,
} from "antd";
import React from "react";
import { ROLE } from "../../constants/role";
import { createCMSUser } from "../../apis/user";
import { toast } from "react-toastify";
import { useForm } from "antd/es/form/Form";
import { omitIsNil } from "../../utils/omit";

type FieldType = {
  email: string;
  password: string;
  price: number;
  name: string;
  confirmPassword?: string;
  phone: string;
  role: ROLE;
};

interface ICreateAccountProps {
  open: boolean;
  onClose: () => void;
  reload: () => void;
}

function CreateAccount(props: ICreateAccountProps) {
  const { open, onClose, reload } = props;

  const [form] = Form.useForm();
  const roleWatch = Form.useWatch("role", form);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    await createCMSUser({
      body: omitIsNil(
        {
          name: values.name,
          email: values.email,
          password: values.password,
          price: values.price,
          phone: values.phone,
          role: values.role,
        },
        { deep: true }
      ),
      successHandler: {
        callBack() {
          toast.success("Tạo tài khoản thành công");
          reload();
          onClose();
        },
      },
    });
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Modal
      title="Tạo tài khoản"
      centered
      open={open}
      onClose={onClose}
      footer={null}
    >
      <Form
        layout="vertical"
        form={form}
        labelCol={{ offset: 8 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item<FieldType>
          label="Họ tên"
          name="name"
          style={{ marginBottom: 8 }}
          rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
        >
          <Input placeholder="Nhập họ tên của bạn" />
        </Form.Item>
        <Form.Item<FieldType>
          label="Địa chỉ Email"
          name="email"
          style={{ marginBottom: 8 }}
          rules={[
            { required: true, message: "Vui lòng nhập Email" },
            { type: "email", message: "Định dạng Email không đúng" },
          ]}
        >
          <Input placeholder="Nhập địa chỉ Email" />
        </Form.Item>
        <Form.Item<FieldType>
          label="Số điện thoại"
          name="phone"
          style={{ marginBottom: 8 }}
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item<FieldType>
          label="Quyền"
          name="role"
          style={{ marginBottom: 8 }}
          rules={[{ required: true, message: "Vui lòng chọn quyền" }]}
        >
          <Select placeholder="Chọn quyền">
            {[ROLE.FIELD_OWNER, ROLE.REFEREE].map((item) => (
              <Select.Option key={item} value={item}>
                {item === ROLE.FIELD_OWNER ? "Chủ sân" : "Trọng tài"}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {roleWatch === ROLE.REFEREE && (
          <Form.Item<FieldType>
            label="Giá tiền"
            name="price"
            style={{ marginBottom: 8 }}
            rules={[{ required: true, message: "Vui lòng nhập giá tiền" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Nhập giá tiền"
            />
          </Form.Item>
        )}

        <Form.Item<FieldType>
          label="Mật khẩu"
          name="password"
          style={{ marginBottom: 8 }}
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>
        <Form.Item<FieldType>
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          style={{ marginBottom: 24 }}
          rules={[
            { required: true, message: "Vui lòng xác nhận lại mật khẩu" },
          ]}
        >
          <Input.Password placeholder="Xác nhận mật khẩu" />
        </Form.Item>
        <Form.Item style={{ marginBottom: 8 }}>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{ fontWeight: 600 }}
          >
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CreateAccount;
