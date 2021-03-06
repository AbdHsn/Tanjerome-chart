USE [PatientChartGeneratorDB]
GO
/****** Object:  Table [dbo].[Dioptres]    Script Date: 7/10/2022 5:55:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Dioptres](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[PatientId] [bigint] NULL,
	[Dioptre] [decimal](8, 2) NULL,
	[CalculatedAge] [decimal](8, 2) NULL,
	[InsertDate] [datetime] NULL,
 CONSTRAINT [PK__Dioptres__3214EC07CA908753] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PatientRecords]    Script Date: 7/10/2022 5:55:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PatientRecords](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[PatientId] [nvarchar](10) NULL,
	[Name] [nvarchar](150) NULL,
	[Phone] [nvarchar](25) NULL,
	[DateOfBirth] [date] NULL,
	[InsertDate] [datetime] NULL,
 CONSTRAINT [PK__PatientR__3214EC0722269C93] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Dioptres] ON 

INSERT [dbo].[Dioptres] ([Id], [PatientId], [Dioptre], [CalculatedAge], [InsertDate]) VALUES (86, 28, CAST(-5.50 AS Decimal(8, 2)), CAST(10.00 AS Decimal(8, 2)), CAST(N'2022-06-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Dioptres] ([Id], [PatientId], [Dioptre], [CalculatedAge], [InsertDate]) VALUES (87, 28, CAST(-4.00 AS Decimal(8, 2)), CAST(10.00 AS Decimal(8, 2)), CAST(N'2022-06-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Dioptres] ([Id], [PatientId], [Dioptre], [CalculatedAge], [InsertDate]) VALUES (88, 29, CAST(-2.75 AS Decimal(8, 2)), CAST(9.00 AS Decimal(8, 2)), CAST(N'2022-05-12T00:00:00.000' AS DateTime))
INSERT [dbo].[Dioptres] ([Id], [PatientId], [Dioptre], [CalculatedAge], [InsertDate]) VALUES (89, 29, CAST(-2.25 AS Decimal(8, 2)), CAST(9.00 AS Decimal(8, 2)), CAST(N'2022-05-12T00:00:00.000' AS DateTime))
INSERT [dbo].[Dioptres] ([Id], [PatientId], [Dioptre], [CalculatedAge], [InsertDate]) VALUES (92, 30, CAST(-3.50 AS Decimal(8, 2)), CAST(11.00 AS Decimal(8, 2)), CAST(N'2022-04-12T00:00:00.000' AS DateTime))
INSERT [dbo].[Dioptres] ([Id], [PatientId], [Dioptre], [CalculatedAge], [InsertDate]) VALUES (93, 30, CAST(-2.50 AS Decimal(8, 2)), CAST(11.00 AS Decimal(8, 2)), CAST(N'2022-04-12T00:00:00.000' AS DateTime))
SET IDENTITY_INSERT [dbo].[Dioptres] OFF
GO
SET IDENTITY_INSERT [dbo].[PatientRecords] ON 

INSERT [dbo].[PatientRecords] ([Id], [PatientId], [Name], [Phone], [DateOfBirth], [InsertDate]) VALUES (28, N'0028', N'Alexander Drago', N'90938027', CAST(N'2012-03-18' AS Date), CAST(N'2022-07-06T11:47:52.067' AS DateTime))
INSERT [dbo].[PatientRecords] ([Id], [PatientId], [Name], [Phone], [DateOfBirth], [InsertDate]) VALUES (29, N'0029', N'Gregorious Nich', N'90938027', CAST(N'2013-12-08' AS Date), CAST(N'2022-07-06T11:51:41.197' AS DateTime))
INSERT [dbo].[PatientRecords] ([Id], [PatientId], [Name], [Phone], [DateOfBirth], [InsertDate]) VALUES (30, N'0030', N'Lucas Zhang', N'93398929', CAST(N'2011-01-01' AS Date), CAST(N'2022-07-06T11:56:00.750' AS DateTime))
SET IDENTITY_INSERT [dbo].[PatientRecords] OFF
GO
ALTER TABLE [dbo].[Dioptres]  WITH CHECK ADD  CONSTRAINT [FK__Dioptres__Calcul__3B75D760] FOREIGN KEY([PatientId])
REFERENCES [dbo].[PatientRecords] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Dioptres] CHECK CONSTRAINT [FK__Dioptres__Calcul__3B75D760]
GO
