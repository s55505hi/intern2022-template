import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  PopoverArrow,
  PopoverHeader,
  IconButton,
  PopoverCloseButton,
  PopoverBody,
  Stack,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { BsFonts } from "react-icons/bs";

export const read = () => {
  return (
    <>
      <PopoverArrow />
      <PopoverHeader>
        予定の詳細
        <IconButton
          icon={<EditIcon />}
          aria-label={"Edit"}
          onClick={() => {
            // editSchedule();
            // onClose();
          }}
          backgroundColor="white"
          ml="145px"
          top="-7px"
          size="xs"
        />
        <IconButton
          icon={<DeleteIcon />}
          aria-label={"Delete"}
          onClick={() => {
            // deleteSchedule(refs.current[refNum]);
            // onClose();
          }}
          backgroundColor="white"
          top="-7px"
          size="xs"
        />
      </PopoverHeader>
      <PopoverCloseButton />
      <PopoverBody>
        <Stack>
          <HStack>
            <Icon as={BsFonts} />
          </HStack>
        </Stack>
      </PopoverBody>
    </>
  );
};
