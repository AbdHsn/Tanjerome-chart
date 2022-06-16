USE [PatientChartGeneratorDB]
GO
/****** Object:  Table [dbo].[PatientRecords]    Script Date: 6/16/2022 9:17:15 AM ******/
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
	[Dioptres] [decimal](8, 2) NULL,
	[InsertDate] [datetime] NULL,
 CONSTRAINT [PK__PatientR__3214EC0722269C93] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[PatientRecords] ON 

INSERT [dbo].[PatientRecords] ([Id], [PatientId], [Name], [Phone], [DateOfBirth], [Dioptres], [InsertDate]) VALUES (4, NULL, N'Quda', N'01422554544', CAST(N'2015-02-12' AS Date), CAST(2.00 AS Decimal(8, 2)), CAST(N'2022-06-16T01:35:13.520' AS DateTime))
INSERT [dbo].[PatientRecords] ([Id], [PatientId], [Name], [Phone], [DateOfBirth], [Dioptres], [InsertDate]) VALUES (5, NULL, N'Omar', N'01345333', CAST(N'2016-02-25' AS Date), CAST(1.00 AS Decimal(8, 2)), CAST(N'2022-06-16T01:36:37.803' AS DateTime))
INSERT [dbo].[PatientRecords] ([Id], [PatientId], [Name], [Phone], [DateOfBirth], [Dioptres], [InsertDate]) VALUES (6, NULL, N'Elon Mask', N'346566667', CAST(N'2005-07-12' AS Date), CAST(5.00 AS Decimal(8, 2)), CAST(N'2022-06-16T01:38:11.177' AS DateTime))
INSERT [dbo].[PatientRecords] ([Id], [PatientId], [Name], [Phone], [DateOfBirth], [Dioptres], [InsertDate]) VALUES (7, NULL, N'Xeon Ria', N'01233454443', CAST(N'2003-01-21' AS Date), CAST(7.00 AS Decimal(8, 2)), CAST(N'2022-06-16T01:38:38.280' AS DateTime))
INSERT [dbo].[PatientRecords] ([Id], [PatientId], [Name], [Phone], [DateOfBirth], [Dioptres], [InsertDate]) VALUES (8, N'X01', N'Riaz...', N'0293420934', CAST(N'2016-01-16' AS Date), CAST(3.00 AS Decimal(8, 2)), CAST(N'2022-06-16T03:07:54.540' AS DateTime))
SET IDENTITY_INSERT [dbo].[PatientRecords] OFF
GO
