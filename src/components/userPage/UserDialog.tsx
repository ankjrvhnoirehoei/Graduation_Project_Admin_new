import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";

interface Props {
  selectedUser: any;
  editMode: boolean;
  lockMode: boolean;
  pin: string;
  onClose: () => void;
  onEditChange: (field: string, value: string) => void;
  onPinChange: (value: string) => void;
}

export default function UserDialog({
  selectedUser,
  editMode,
  lockMode,
  pin,
  onClose,
  onEditChange,
  onPinChange,
}: Props) {
  return (
    <Dialog open={!!selectedUser} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <h2 className="text-lg font-semibold">
            {editMode
              ? "Chỉnh sửa người dùng"
              : lockMode
              ? "Xác nhận khóa/Mở khóa"
              : "Chi tiết người dùng"}
          </h2>
        </DialogHeader>

        {selectedUser && !editMode && !lockMode && (
          <div className="space-y-4">
            <img
              src={selectedUser.avatar}
              alt="avatar"
              className="rounded-full w-20 h-20 object-cover mx-auto border shadow-sm"
            />
            <div>
              <strong>Tên:</strong> {selectedUser.name}
            </div>
            <div>
              <strong>Email:</strong> {selectedUser.email}
            </div>
            <div>
              <strong>Thời gian đăng ký:</strong> {selectedUser.createdAt}
            </div>
            <div>
              <strong>Trạng thái:</strong> {selectedUser.status}
            </div>
            <DialogFooter>
              <Button onClick={onClose}>Đóng</Button>
            </DialogFooter>
          </div>
        )}

        {selectedUser && editMode && (
          <div className="space-y-4">
            <img
              src={selectedUser.avatar}
              alt="avatar"
              className="rounded-full w-20 h-20 object-cover mx-auto border shadow-sm"
            />
            <Input
              value={selectedUser.name}
              onChange={(e) => onEditChange("name", e.target.value)}
              placeholder="Tên người dùng"
            />
            <Input
              value={selectedUser.email}
              onChange={(e) => onEditChange("email", e.target.value)}
              placeholder="Email"
            />
            <Input
              value={selectedUser.avatar}
              onChange={(e) => onEditChange("avatar", e.target.value)}
              placeholder="Avatar URL"
            />
            <Input
              value={selectedUser.status}
              onChange={(e) => onEditChange("status", e.target.value)}
              placeholder="Trạng thái"
            />
            <DialogFooter>
              <Button onClick={() => console.log("Xác nhận sửa", selectedUser)}>
                Xác nhận
              </Button>
              <Button variant="outline" onClick={onClose}>
                Hủy
              </Button>
            </DialogFooter>
          </div>
        )}

        {selectedUser && lockMode && (
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              Nhập mã PIN 6 chữ số để xác nhận thao tác:
            </p>
            <div className="flex justify-center gap-2">
              {[...Array(6)].map((_, idx) => (
                <input
                  key={idx}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-10 h-12 text-center border rounded text-lg"
                  value={pin[idx] || ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 1);
                    const newPin = pin.split("");
                    newPin[idx] = val;
                    onPinChange(newPin.join(""));
                  }}
                />
              ))}
            </div>
            <DialogFooter>
              <Button onClick={() => console.log("Xác nhận khoá/mở", pin)}>
                Xác nhận
              </Button>
              <Button variant="outline" onClick={onClose}>
                Hủy
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
