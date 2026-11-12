import Modal from "./Modal";
import Button from "./Button";

function DraftRestoreModal({ open, onRestore, onNew }) {
  return (
    <Modal
      open={open}
      title="작성하던 아이디어가 있어요"
      description="저장된 내용을 불러와서 이어서 쓸까요?"
    >
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onNew}>
          새로 시작
        </Button>
        <Button onClick={onRestore}>불러오기</Button>
      </div>
    </Modal>
  );
}

export default DraftRestoreModal;
