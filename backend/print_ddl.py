import inspect
import entity
from sqlalchemy.schema import CreateTable
from sqlalchemy.dialects import postgresql


table_classes = list(map(lambda x: x[1], inspect.getmembers(entity, inspect.isclass)))
table_classes = list(filter(lambda cls: issubclass(cls, entity.Base) and cls != entity.Base, table_classes))

for cls in table_classes:
    print(CreateTable(cls.__table__).compile(dialect=postgresql.dialect()))
