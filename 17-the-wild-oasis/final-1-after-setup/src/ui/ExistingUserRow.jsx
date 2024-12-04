import styled from "styled-components";
import Table from "./Table";
import Menus from "./Menus";
import Modal from "./Modal";
import { HiTrash } from "react-icons/hi2";
import ConfirmDelete from "./ConfirmDelete";

const Img = styled.img`
  display: block;
  width: 5rem;
  aspect-ratio: 1;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const User = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const handleDelete = () => {
  console.log("delete");
};

function ExistingUserRow({ user }) {
  return (
    <Table.Row>
      <Img src={user.user_metadata.avatar} />
      <User>{user.user_metadata.fullName}</User>
      <div>{user.email}</div>
      <div>{user.role}</div>
      <div>
        {new Date(user.created_at).toLocaleString("en", { dateStyle: "long" })}
      </div>
      <Modal>
        <Menus.Menu>
          <Menus.Toggle id={user.id} />
          <Menus.List id={user.id}>
            <Modal.Open opens="delete">
              <Menus.Button icon={<HiTrash />} onClick={handleDelete}>
                Delete
              </Menus.Button>
            </Modal.Open>
          </Menus.List>

          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="user"
              disabled={false}
              onConfirm={() => {}}
            />
          </Modal.Window>
        </Menus.Menu>
      </Modal>
    </Table.Row>
  );
}

export default ExistingUserRow;
