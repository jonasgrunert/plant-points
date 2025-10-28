import { Button, ListBoxItem } from "react-aria-components";
import list from "../assets/list.json";
import { useTranslation } from "react-i18next";
import { IconTrashX } from "@tabler/icons-react";
import { useFetcher } from "react-router";
import type { Category } from "../storage/plantPoints";

export const SearchPlant = ({
  plantId,
  data,
}: {
  plantId: keyof typeof list;
  data: {
    category: "vegetables" | "herbs" | "fruit" | "legumes" | "nuts" | "grains";
    points: number;
  };
}) => {
  const { t } = useTranslation();
  const { t: plants } = useTranslation("plants");
  return (
    <ListBoxItem textValue={plants(plantId)} id={plantId} key={plantId}>
      <hgroup className="plant">
        <h5>{plants(plantId)}</h5>
        <p>
          <i>{t(data.category)}</i>
        </p>
      </hgroup>
      <hgroup className="point">
        <h5>{data.points}</h5>
        <p>
          <i>{t("point", { count: data.points })}</i>
        </p>
      </hgroup>
    </ListBoxItem>
  );
};

export const LogPlant = ({
  plantId,
  data,
  id,
  rev,
}: {
  id: string;
  rev: string;
  plantId: keyof typeof list;
  data: {
    category: Category;
    points: number;
  };
}) => {
  const { t } = useTranslation();
  const { t: plants } = useTranslation("plants");
  const { Form } = useFetcher();
  return (
    <ListBoxItem textValue={plants(plantId)} key={plantId}>
      <hgroup className="plant">
        <h5>{plants(plantId)}</h5>
        <p>
          <i>{t(data.category)}</i>
        </p>
      </hgroup>
      <hgroup className="point">
        <h5>{data.points}</h5>
        <p>
          <i>{t("point", { count: data.points })}</i>
        </p>
      </hgroup>
      <Form method="POST">
        <input type="hidden" name="_id" value={id} />
        <input type="hidden" name="_rev" value={rev} />
        <input type="hidden" name="action" value="delete" />
        <Button type="submit" className="outline" aria-label="Remove entry">
          <IconTrashX size={36} />
        </Button>
      </Form>
    </ListBoxItem>
  );
};
