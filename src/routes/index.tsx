import { useTranslation } from "react-i18next";
import {
  useFetcher,
  useLoaderData,
  type ActionFunctionArgs,
  type RouteObject,
} from "react-router";
import { db, type Category, type Plant } from "../storage/plantPoints";
import { DateTime, Duration } from "luxon";
import {
  Button,
  Cell,
  Collection,
  Column,
  ComboBox,
  Header,
  Input,
  ListBox,
  ListBoxSection,
  Popover,
  Row,
  Table,
  TableBody,
  TableHeader,
} from "react-aria-components";
import list from "../assets/list.json";
import { useRef } from "react";
import { LogPlant, SearchPlant } from "../components/plant";

const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const action = formData.get("action");
  if (action === "add") {
    const plant = formData.get("plant") as Plant;
    if (plant === null) {
      return new Response("No plant to add", { status: 400 });
    }
    const date = DateTime.now().toISO();
    await db.put({
      _id: date + "-" + plant,
      type: "log",
      plant,
      date,
    });
    return { plant };
  }
  if (action === "delete") {
    await db.remove({
      _id: formData.get("_id") as string,
      _rev: formData.get("_rev") as string,
    });
  }
};

const loader = async () => {
  const now = DateTime.now();
  const date = now.minus(Duration.fromObject({ days: 7 })).toISODate();
  const docs = await db.allDocs({
    include_docs: true,
    startkey: now.toISO(),
    endkey: date,
    descending: true,
  });
  const result = docs.rows.reduce(
    (p, c) => {
      const existing = p.table.get(c.doc!.plant);
      p.table.set(c.doc!.plant, (existing ?? 0) + 1);
      const day = DateTime.fromISO(c.doc!.date).toISODate()!;
      const entry = {
        id: c.id,
        plant: c.doc!.plant,
        points: existing === undefined ? list[c.doc!.plant].points : 0,
        rev: c.value.rev,
        category: list[c.doc!.plant].category as Category,
      };
      if (p.days[0]?.day === day) {
        p.days[0].entries.push(entry);
      } else {
        p.days.push({
          day,
          entries: [entry],
        });
      }
      return p;
    },
    {
      table: new Map<keyof typeof list, number>(),
      days: [] as {
        day: string;
        entries: [
          {
            id: string;
            points: number;
            rev: string;
            plant: Plant;
            category: Category;
          }
        ];
      }[],
    }
  );
  return {
    ...result,
    points: [...result.table.keys()].reduce((p, c) => p + list[c].points, 0),
  };
};

const SearchPlants = () => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <ComboBox aria-label={t("inputPlant")} name="plant">
      <Input placeholder={t("inputPlant")} ref={inputRef} />
      <Popover triggerRef={inputRef} className="container react-aria-Popover">
        <ListBox
          items={Object.entries(list).map(([plantId, data]) => ({
            id: plantId as Plant,
            points: data.points,
            category: data.category as Category,
          }))}
        >
          {(item) => <SearchPlant plantId={item.id} data={item} />}
        </ListBox>
      </Popover>
    </ComboBox>
  );
};

const Index = () => {
  const { t, i18n } = useTranslation();
  const { t: plants } = useTranslation("plants");
  const data = useLoaderData<typeof loader>();
  const { Form } = useFetcher();
  const today = DateTime.local();
  const yesterday = today.minus({ day: 1 });
  return (
    <>
      <Form method="POST">
        <input type="hidden" name="action" value="add" />
        <fieldset className="group">
          <SearchPlants />
          <Button type="submit">{t("addPlant")}</Button>
        </fieldset>
      </Form>
      <details>
        <summary role="button" className="outline">
          <span>{t("lastDays", { days: 7 })}</span>
          <span>
            {data.points} {t("point", { count: data.points })}
          </span>
        </summary>
        <Table>
          <TableHeader>
            <Column isRowHeader>{t("plant")}</Column>
            <Column>{t("count")}</Column>
          </TableHeader>
          <TableBody>
            {[...data.table.entries()].map(([plant, count]) => (
              <Row key={plant}>
                <Cell>{plants(plant)}</Cell>
                <Cell>{count}</Cell>
              </Row>
            ))}
          </TableBody>
        </Table>
      </details>
      <ListBox items={data.days.map((d) => ({ id: d.day, items: d.entries }))}>
        {(day) => {
          const date = DateTime.fromISO(day.id);
          let name = date
            .setLocale(i18n.language)
            .toLocaleString(DateTime.DATE_HUGE);
          if (date.hasSame(today, "day")) {
            name = t("today");
          } else if (date.hasSame(yesterday, "day")) {
            name = t("yesterday");
          }
          return (
            <ListBoxSection>
              <Header>{name}</Header>
              <Collection items={day.items}>
                {(entry) => (
                  <LogPlant
                    plantId={entry.plant}
                    rev={entry.rev}
                    id={entry.id}
                    data={{ points: entry.points, category: entry.category }}
                  />
                )}
              </Collection>
            </ListBoxSection>
          );
        }}
      </ListBox>
    </>
  );
};

export const route: RouteObject = {
  index: true,
  element: <Index />,
  loader,
  action,
};
